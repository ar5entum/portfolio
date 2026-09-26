"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { useScene, heightAt, inWorld, telemetry, pushSeries, resetSeries } from "@/lib/landscape/store";
import { Optimizer, numericGrad, optimizerIds, type OptimizerId } from "@/lib/landscape/optimizers";
import { presets, randomSpawn } from "@/lib/landscape/functions";
import { useThemeColors } from "./useThemeColors";

const TRAIL = 200;
const STEP_HZ = 60;
const STEP_DT = 1 / STEP_HZ;
const REDROP_EVERY = 14; // seconds, ambient mode

type Walker = {
  id: OptimizerId;
  opt: Optimizer;
  line: Line2;
  geom: LineGeometry;
  mat: LineMaterial;
  positions: Float32Array; // TRAIL * 3
  colors: Float32Array; // TRAIL * 3
  head: number; // number of valid points
  stalled: number;
  age: number;
  bead: THREE.Mesh;
  y: number;
};

const grad = numericGrad(heightAt, 2e-3);

export function Particles() {
  const group = useRef<THREE.Group>(null);
  const colors = useThemeColors();
  const optimizers = useScene((s) => s.optimizers);
  const dropSeq = useScene((s) => s.dropSeq);
  const walkers = useRef<Map<OptimizerId, Walker>>(new Map());
  const acc = useRef(0);
  const sinceDrop = useRef(0);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const bgColor = useMemo(() => new THREE.Color(), []);
  const resolution = useMemo(() => new THREE.Vector2(1, 1), []);

  // Create / destroy walkers to match the optimizer list.
  useEffect(() => {
    const g = group.current;
    if (!g) return;
    const map = walkers.current;
    for (const id of optimizerIds) {
      const want = optimizers.includes(id);
      const has = map.has(id);
      if (want && !has) {
        map.set(id, makeWalker(id, g, resolution));
      } else if (!want && has) {
        const w = map.get(id)!;
        g.remove(w.line, w.bead);
        w.geom.dispose();
        w.mat.dispose();
        (w.bead.geometry as THREE.BufferGeometry).dispose();
        (w.bead.material as THREE.Material).dispose();
        map.delete(id);
      }
    }
  }, [optimizers, resolution]);

  // Re-drop everything when asked (function change, playground reset).
  useEffect(() => {
    for (const w of walkers.current.values()) respawn(w);
    sinceDrop.current = 0;
  }, [dropSeq]);

  useEffect(() => {
    const map = walkers.current;
    const g = group.current;
    return () => {
      for (const w of map.values()) {
        g?.remove(w.line, w.bead);
        w.geom.dispose();
        w.mat.dispose();
      }
      map.clear();
    };
  }, []);

  useFrame((state, dt) => {
    const s = useScene.getState();
    resolution.set(state.size.width * state.viewport.dpr, state.size.height * state.viewport.dpr);
    bgColor.set(colors.bg);

    const map = walkers.current;
    if (map.size === 0) return;

    // fixed-timestep integration so speed doesn't depend on refresh rate
    const clamped = Math.min(dt, 0.1);
    if (s.running && !s.reducedMotion) acc.current += clamped;
    let steps = 0;
    while (acc.current >= STEP_DT && steps < 4) {
      acc.current -= STEP_DT;
      steps += 1;
    }

    if (s.ambient) {
      sinceDrop.current += clamped;
      if (sinceDrop.current > REDROP_EVERY) {
        for (const w of map.values()) respawn(w);
        sinceDrop.current = 0;
      }
    }

    let lead: Walker | null = null;
    for (const w of map.values()) {
      for (let i = 0; i < steps; i++) {
        w.opt.step(grad, s.hyper);
        w.age += STEP_DT;
        if (!inWorld(w.opt.x, w.opt.z)) {
          respawn(w);
          break;
        }
        pushSeries(w.id, heightAt(w.opt.x, w.opt.z));
        if (w.opt.gradNorm < 0.004) w.stalled += 1;
        else w.stalled = 0;
        // stalled at a minimum for a while: in ambient mode go again elsewhere
        if (s.ambient && w.stalled > 240) {
          respawn(w);
          break;
        }
        pushPoint(w);
      }
      if (steps > 0) uploadTrail(w, colors.opt[w.id], bgColor, tmpColor, colors.glow);
      // bead follows the head
      w.y = heightAt(w.opt.x, w.opt.z);
      w.bead.position.set(w.opt.x, w.y + 0.06, w.opt.z);
      (w.bead.material as THREE.MeshBasicMaterial).color.set(colors.opt[w.id]);
      w.mat.color.set(colors.opt[w.id]);
      if (!lead || w.y < lead.y) lead = w;
    }

    if (lead) {
      telemetry.loss = lead.y;
      telemetry.steps = lead.opt.steps;
      telemetry.optimizer = lead.id;
      telemetry.fn = s.fnTo;
    }
  });

  return <group ref={group} />;
}

function makeWalker(id: OptimizerId, parent: THREE.Group, resolution: THREE.Vector2): Walker {
  const positions = new Float32Array(TRAIL * 3);
  const colors = new Float32Array(TRAIL * 3);
  const geom = new LineGeometry();
  geom.setPositions(positions);
  geom.setColors(colors);
  const mat = new LineMaterial({
    linewidth: 2.2,
    vertexColors: true,
    worldUnits: false,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  mat.resolution = resolution;
  const line = new Line2(geom, mat);
  line.frustumCulled = false;
  const bead = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 14, 14),
    new THREE.MeshBasicMaterial({ toneMapped: false }),
  );
  parent.add(line, bead);
  const w: Walker = {
    id,
    opt: new Optimizer(id),
    line,
    geom,
    mat,
    positions,
    colors,
    head: 0,
    stalled: 0,
    age: 0,
    bead,
    y: 0,
  };
  respawn(w);
  return w;
}

function respawn(w: Walker) {
  const s = useScene.getState();
  const preset = s.fnTo !== "custom" ? presets[s.fnTo] : null;
  let x: number, z: number;
  if (preset?.spawn && Math.random() < 0.7) {
    const p = preset.spawn[Math.floor(Math.random() * preset.spawn.length)];
    x = p[0] + (Math.random() - 0.5) * 0.8;
    z = p[1] + (Math.random() - 0.5) * 0.8;
  } else {
    [x, z] = randomSpawn();
  }
  w.opt.reset(x, z);
  w.head = 0;
  w.stalled = 0;
  w.age = 0;
  resetSeries(w.id);
  const y = heightAt(x, z);
  for (let i = 0; i < TRAIL; i++) {
    w.positions[i * 3] = x;
    w.positions[i * 3 + 1] = y + 0.04;
    w.positions[i * 3 + 2] = z;
  }
}

function pushPoint(w: Walker) {
  const y = heightAt(w.opt.x, w.opt.z) + 0.04;
  // shift left by one, append at the end (oldest first)
  w.positions.copyWithin(0, 3, TRAIL * 3);
  const i = (TRAIL - 1) * 3;
  w.positions[i] = w.opt.x;
  w.positions[i + 1] = y;
  w.positions[i + 2] = w.opt.z;
  w.head = Math.min(TRAIL, w.head + 1);
}

function uploadTrail(w: Walker, hex: string, bg: THREE.Color, tmp: THREE.Color, glow: number) {
  tmp.set(hex);
  // fade the tail towards the background; head is full colour. Points that
  // haven't been written yet (head < TRAIL) are collapsed onto the spawn so
  // they render as nothing.
  const start = TRAIL - w.head;
  for (let i = 0; i < TRAIL; i++) {
    const t = i < start ? 0 : (i - start) / Math.max(1, w.head - 1);
    const k = Math.pow(t, 1.6);
    const r = bg.r + (tmp.r - bg.r) * k;
    const g = bg.g + (tmp.g - bg.g) * k;
    const b = bg.b + (tmp.b - bg.b) * k;
    // in the dark theme push the head above 1.0 so bloom picks it up
    const boost = glow > 0.5 ? 1 + 0.6 * k : 1;
    w.colors[i * 3] = r * boost;
    w.colors[i * 3 + 1] = g * boost;
    w.colors[i * 3 + 2] = b * boost;
  }
  // LineGeometry.setPositions/setColors allocate new buffers every call; write
  // straight into the interleaved buffers it created the first time instead.
  const pos = (w.geom.attributes.instanceStart as THREE.InterleavedBufferAttribute).data;
  const col = (w.geom.attributes.instanceColorStart as THREE.InterleavedBufferAttribute).data;
  const P = pos.array as Float32Array;
  const C = col.array as Float32Array;
  // segment i = [point i, point i+1], six floats each
  for (let i = 0; i < TRAIL - 1; i++) {
    const s = i * 6;
    const a = i * 3;
    P[s] = w.positions[a];
    P[s + 1] = w.positions[a + 1];
    P[s + 2] = w.positions[a + 2];
    P[s + 3] = w.positions[a + 3];
    P[s + 4] = w.positions[a + 4];
    P[s + 5] = w.positions[a + 5];
    C[s] = w.colors[a];
    C[s + 1] = w.colors[a + 1];
    C[s + 2] = w.colors[a + 2];
    C[s + 3] = w.colors[a + 3];
    C[s + 4] = w.colors[a + 4];
    C[s + 5] = w.colors[a + 5];
  }
  pos.needsUpdate = true;
  col.needsUpdate = true;
}
