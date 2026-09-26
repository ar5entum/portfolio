/**
 * Loss-landscape presets.
 *
 * World space is a 12x12 plane (x, z in [-6, 6]). Each preset maps world
 * coordinates into its own natural domain, evaluates, and rescales the height
 * so every surface has comparable relief (roughly [0, 5] world units).
 *
 * Every preset exists twice: `js` for the CPU (optimizer particles) and `glsl`
 * for the vertex shader. They must agree; the shader is the source of truth for
 * what you see and the CPU version is what the particles walk on.
 */

export const WORLD_HALF = 6;

export type FnId = "saddle" | "himmelblau" | "rosenbrock" | "rastrigin" | "beale" | "ackley" | "custom";

export type FnPreset = {
  id: FnId;
  name: string;
  /** Pretty formula for the UI */
  formula: string;
  /** half-width of the function's natural domain; world x -> x * domain / WORLD_HALF */
  domain: number;
  js: (x: number, z: number) => number;
  /** GLSL body for `float fn_<id>(float x, float z)` operating on WORLD coords */
  glsl: string;
  /** a good place to drop particles (world coords), else random */
  spawn?: [number, number][];
};

const TAU = Math.PI * 2;

export const presets: Record<Exclude<FnId, "custom">, FnPreset> = {
  saddle: {
    id: "saddle",
    name: "Saddle",
    formula: "0.09 (x² − z²)",
    domain: 6,
    js: (x, z) => 0.09 * (x * x - z * z),
    glsl: `return 0.09 * (x * x - z * z);`,
    spawn: [
      [0.4, -4.5],
      [-0.6, 4.2],
      [0.2, 5.0],
    ],
  },
  himmelblau: {
    id: "himmelblau",
    name: "Himmelblau",
    formula: "(x² + z − 11)² + (x + z² − 7)²",
    domain: 5,
    js: (x, z) => {
      const s = 5 / WORLD_HALF;
      const fx = x * s;
      const fz = z * s;
      const a = fx * fx + fz - 11;
      const b = fx + fz * fz - 7;
      return Math.sqrt(a * a + b * b) * 0.18;
    },
    glsl: `
      float s = 5.0 / 6.0;
      float fx = x * s; float fz = z * s;
      float a = fx * fx + fz - 11.0;
      float b = fx + fz * fz - 7.0;
      return sqrt(a * a + b * b) * 0.18;`,
    spawn: [
      [0, 0],
      [-5.5, -5.5],
      [5.5, 5.5],
      [-5.5, 5.5],
      [5.5, -5.5],
    ],
  },
  rosenbrock: {
    id: "rosenbrock",
    name: "Rosenbrock",
    formula: "(1 − x)² + 100 (z − x²)²",
    domain: 2,
    js: (x, z) => {
      const s = 2 / WORLD_HALF;
      const fx = x * s;
      const fz = z * s + 1; // shift so the valley sits in view
      const a = 1 - fx;
      const b = fz - fx * fx;
      return Math.log1p(a * a + 100 * b * b) * 0.55;
    },
    glsl: `
      float s = 2.0 / 6.0;
      float fx = x * s; float fz = z * s + 1.0;
      float a = 1.0 - fx; float b = fz - fx * fx;
      return log(1.0 + a * a + 100.0 * b * b) * 0.55;`,
    spawn: [
      [-5, -4.5],
      [5, -4.5],
      [-4.5, 5.5],
    ],
  },
  rastrigin: {
    id: "rastrigin",
    name: "Rastrigin",
    formula: "20 + Σ (xᵢ² − 10 cos 2πxᵢ)",
    domain: 4,
    js: (x, z) => {
      const s = 4 / WORLD_HALF;
      const fx = x * s;
      const fz = z * s;
      return (20 + fx * fx - 10 * Math.cos(TAU * fx) + fz * fz - 10 * Math.cos(TAU * fz)) * 0.065;
    },
    glsl: `
      float s = 4.0 / 6.0;
      float fx = x * s; float fz = z * s;
      return (20.0 + fx * fx - 10.0 * cos(6.2831853 * fx) + fz * fz - 10.0 * cos(6.2831853 * fz)) * 0.065;`,
  },
  beale: {
    id: "beale",
    name: "Beale",
    formula: "(1.5 − x + xz)² + (2.25 − x + xz²)² + (2.625 − x + xz³)²",
    domain: 4.5,
    js: (x, z) => {
      const s = 4.5 / WORLD_HALF;
      const fx = x * s;
      const fz = z * s;
      const a = 1.5 - fx + fx * fz;
      const b = 2.25 - fx + fx * fz * fz;
      const c = 2.625 - fx + fx * fz * fz * fz;
      return Math.log1p(a * a + b * b + c * c) * 0.42;
    },
    glsl: `
      float s = 4.5 / 6.0;
      float fx = x * s; float fz = z * s;
      float a = 1.5 - fx + fx * fz;
      float b = 2.25 - fx + fx * fz * fz;
      float c = 2.625 - fx + fx * fz * fz * fz;
      return log(1.0 + a * a + b * b + c * c) * 0.42;`,
    spawn: [
      [-5, 1.5],
      [5, -3],
      [-2, -5],
    ],
  },
  ackley: {
    id: "ackley",
    name: "Ackley",
    formula: "−20 e^{−0.2 √(0.5(x²+z²))} − e^{0.5(cos 2πx + cos 2πz)} + e + 20",
    domain: 5,
    js: (x, z) => {
      const s = 5 / WORLD_HALF;
      const fx = x * s;
      const fz = z * s;
      const a = -20 * Math.exp(-0.2 * Math.sqrt(0.5 * (fx * fx + fz * fz)));
      const b = -Math.exp(0.5 * (Math.cos(TAU * fx) + Math.cos(TAU * fz)));
      return (a + b + Math.E + 20) * 0.34;
    },
    glsl: `
      float s = 5.0 / 6.0;
      float fx = x * s; float fz = z * s;
      float a = -20.0 * exp(-0.2 * sqrt(0.5 * (fx * fx + fz * fz)));
      float b = -exp(0.5 * (cos(6.2831853 * fx) + cos(6.2831853 * fz)));
      return (a + b + 2.7182818 + 20.0) * 0.34;`,
  },
};

export const presetIds = Object.keys(presets) as Exclude<FnId, "custom">[];

/** Numeric id used to select a function inside the shader. */
export const fnIndex: Record<FnId, number> = {
  saddle: 0,
  himmelblau: 1,
  rosenbrock: 2,
  rastrigin: 3,
  beale: 4,
  ackley: 5,
  custom: 6,
};

/** Random spawn inside the world, biased away from the exact centre. */
export function randomSpawn(): [number, number] {
  const r = 2.5 + Math.random() * 3;
  const a = Math.random() * TAU;
  return [Math.cos(a) * r, Math.sin(a) * r];
}
