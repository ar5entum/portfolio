/**
 * First-order optimizers walking a 2D surface. Each keeps its own state and
 * takes one step given a gradient function. Ported from the 2023 site, with
 * Adam's bias correction and Nesterov's lookahead done properly.
 */

export type OptimizerId = "sgd" | "momentum" | "nesterov" | "adagrad" | "rmsprop" | "adam";

export const optimizerIds: OptimizerId[] = ["sgd", "momentum", "nesterov", "adagrad", "rmsprop", "adam"];

export const optimizerMeta: Record<OptimizerId, { name: string; short: string; cssVar: string }> = {
  sgd: { name: "SGD", short: "SGD", cssVar: "--opt-sgd" },
  momentum: { name: "Momentum", short: "MOM", cssVar: "--opt-momentum" },
  nesterov: { name: "Nesterov", short: "NAG", cssVar: "--opt-nesterov" },
  adagrad: { name: "Adagrad", short: "ADG", cssVar: "--opt-adagrad" },
  rmsprop: { name: "RMSProp", short: "RMS", cssVar: "--opt-rmsprop" },
  adam: { name: "Adam", short: "ADAM", cssVar: "--opt-adam" },
};

export type Grad = (x: number, z: number) => [number, number];

export type Hyper = {
  lr: number;
  /** β for momentum / nesterov / rmsprop, β1 for adam */
  beta: number;
  /** β2 for adam */
  beta2: number;
};

export const defaultHyper: Hyper = { lr: 0.05, beta: 0.9, beta2: 0.999 };

const EPS = 1e-8;

export class Optimizer {
  readonly id: OptimizerId;
  x = 0;
  z = 0;
  /** first moment / velocity */
  private mx = 0;
  private mz = 0;
  /** second moment / accumulated squared grads */
  private vx = 0;
  private vz = 0;
  private t = 0;
  /** last gradient magnitude, for stall detection */
  gradNorm = 0;
  steps = 0;

  constructor(id: OptimizerId, x = 0, z = 0) {
    this.id = id;
    this.reset(x, z);
  }

  reset(x: number, z: number) {
    this.x = x;
    this.z = z;
    this.mx = this.mz = this.vx = this.vz = 0;
    this.t = 0;
    this.steps = 0;
    this.gradNorm = 0;
  }

  step(grad: Grad, h: Hyper) {
    const { lr, beta, beta2 } = h;
    let dx: number, dz: number;

    switch (this.id) {
      case "sgd": {
        [dx, dz] = grad(this.x, this.z);
        this.x -= lr * dx;
        this.z -= lr * dz;
        break;
      }
      case "momentum": {
        [dx, dz] = grad(this.x, this.z);
        this.mx = beta * this.mx + dx;
        this.mz = beta * this.mz + dz;
        this.x -= lr * this.mx;
        this.z -= lr * this.mz;
        break;
      }
      case "nesterov": {
        // evaluate the gradient at the lookahead position
        [dx, dz] = grad(this.x - lr * beta * this.mx, this.z - lr * beta * this.mz);
        this.mx = beta * this.mx + dx;
        this.mz = beta * this.mz + dz;
        this.x -= lr * this.mx;
        this.z -= lr * this.mz;
        break;
      }
      case "adagrad": {
        [dx, dz] = grad(this.x, this.z);
        this.vx += dx * dx;
        this.vz += dz * dz;
        // adagrad's effective lr decays fast; scale up so it stays visible
        const a = lr * 3;
        this.x -= (a / (Math.sqrt(this.vx) + EPS)) * dx;
        this.z -= (a / (Math.sqrt(this.vz) + EPS)) * dz;
        break;
      }
      case "rmsprop": {
        [dx, dz] = grad(this.x, this.z);
        this.vx = beta * this.vx + (1 - beta) * dx * dx;
        this.vz = beta * this.vz + (1 - beta) * dz * dz;
        this.x -= (lr / (Math.sqrt(this.vx) + EPS)) * dx;
        this.z -= (lr / (Math.sqrt(this.vz) + EPS)) * dz;
        break;
      }
      case "adam": {
        [dx, dz] = grad(this.x, this.z);
        this.t += 1;
        this.mx = beta * this.mx + (1 - beta) * dx;
        this.mz = beta * this.mz + (1 - beta) * dz;
        this.vx = beta2 * this.vx + (1 - beta2) * dx * dx;
        this.vz = beta2 * this.vz + (1 - beta2) * dz * dz;
        const bc1 = 1 - Math.pow(beta, this.t);
        const bc2 = 1 - Math.pow(beta2, this.t);
        const mxh = this.mx / bc1;
        const mzh = this.mz / bc1;
        const vxh = this.vx / bc2;
        const vzh = this.vz / bc2;
        this.x -= (lr / (Math.sqrt(vxh) + EPS)) * mxh;
        this.z -= (lr / (Math.sqrt(vzh) + EPS)) * mzh;
        break;
      }
    }

    this.gradNorm = Math.hypot(dx, dz);
    this.steps += 1;
  }
}

/** Central-difference gradient of a scalar field. */
export function numericGrad(f: (x: number, z: number) => number, h = 1e-3): Grad {
  return (x, z) => [(f(x + h, z) - f(x - h, z)) / (2 * h), (f(x, z + h) - f(x, z - h)) / (2 * h)];
}
