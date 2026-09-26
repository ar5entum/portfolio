"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { damp3 } from "maath/easing";
import { useScene, well, type CameraPreset } from "@/lib/landscape/store";

type Pose = { pos: [number, number, number]; target: [number, number, number]; orbit: number };

const POSES: Record<CameraPreset, Pose> = {
  hero: { pos: [10, 7.5, 12.5], target: [0, 0.2, 0], orbit: 0.05 },
  skills: { pos: [-11, 8.5, 10], target: [0, 0.2, 0], orbit: 0.03 },
  path: { pos: [12, 7, -8], target: [0, 0.4, 0], orbit: 0 },
  research: { pos: [0, 14, 11], target: [0, 0, 0], orbit: 0.04 },
  flat: { pos: [0, 20, 3], target: [0, 0, 0], orbit: 0 },
  playground: { pos: [10, 8.5, 10], target: [0, 0.3, 0], orbit: 0 },
  lost: { pos: [17, 3.5, 17], target: [0, 2, 0], orbit: 0.2 },
};

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();
const _ray = new THREE.Raycaster();
const _plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _hit = new THREE.Vector3();
const _ndc = new THREE.Vector2();

export function Rig() {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3(0, 0.6, 0));
  const angle = useRef(0);
  const pointerOn = useRef(false);
  const parked = useRef(false);
  const ndc = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((state, dt) => {
    const s = useScene.getState();
    const pose = POSES[s.camera];
    const d = Math.min(dt, 0.05);

    // slow orbit around the target in ambient presets
    if (!s.reducedMotion) angle.current += pose.orbit * d;
    const a = angle.current;
    const r = Math.hypot(pose.pos[0], pose.pos[2]);
    const base = Math.atan2(pose.pos[2], pose.pos[0]);
    _pos.set(Math.cos(base + a) * r, pose.pos[1], Math.sin(base + a) * r);
    _target.set(...pose.target);

    // Path section: descend along the diagonal as the user scrolls
    if (s.camera === "path") {
      const p = s.descent;
      _pos.set(12 - p * 7, 7.5 - p * 3, -8 + p * 12);
      _target.set(-p * 2, 0.3, p * 2);
    }

    // parallax from pointer (screen space), tiny
    const px = state.pointer.x;
    const py = state.pointer.y;
    if (!s.reducedMotion && s.camera !== "playground") {
      _pos.x += px * 0.35;
      _pos.y += py * 0.25;
    }

    // In the playground OrbitControls owns the camera; we only fly in once.
    if (s.camera === "playground") {
      if (!parked.current) {
        damp3(camera.position, _pos, 0.6, d);
        damp3(lookAt.current, _target, 0.6, d);
        camera.lookAt(lookAt.current);
        if (camera.position.distanceTo(_pos) < 0.05) parked.current = true;
      }
    } else {
      parked.current = false;
      const smooth = 1.1;
      damp3(camera.position, _pos, smooth, d);
      damp3(lookAt.current, _target, smooth, d);
      camera.lookAt(lookAt.current);
    }

    // pointer well: project the mouse onto the y=0 plane
    const moved = state.pointer.x !== ndc.x || state.pointer.y !== ndc.y;
    ndc.copy(state.pointer);
    if (moved) pointerOn.current = true;
    _ndc.copy(state.pointer);
    _ray.setFromCamera(_ndc, camera);
    const hit = _ray.ray.intersectPlane(_plane, _hit);
    const want = pointerOn.current && hit && !s.reducedMotion && Math.abs(hit.x) < 7 && Math.abs(hit.z) < 7 ? 1 : 0;
    if (hit && want) {
      well.x += (hit.x - well.x) * Math.min(1, d * 8);
      well.z += (hit.z - well.z) * Math.min(1, d * 8);
    }
    well.s += (want - well.s) * Math.min(1, d * 3);
  });

  return null;
}
