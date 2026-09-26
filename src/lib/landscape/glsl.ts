/**
 * Translate a mathjs expression tree into a GLSL expression, so a custom
 * f(x, z) typed in the playground can run in the vertex shader.
 *
 * Supports: + - * / ^, unary minus, parentheses, x/z/pi/e, numeric constants and
 * a whitelist of one/two-argument functions. Anything else throws.
 */
import { parse, type MathNode } from "mathjs";

const FN1: Record<string, string> = {
  sin: "sin",
  cos: "cos",
  tan: "tan",
  asin: "asin",
  acos: "acos",
  atan: "atan",
  sinh: "sinh",
  cosh: "cosh",
  tanh: "tanh",
  exp: "exp",
  sqrt: "sqrt",
  abs: "abs",
  floor: "floor",
  ceil: "ceil",
  sign: "sign",
  log: "log",
  ln: "log",
};

const FN2: Record<string, string> = {
  pow: "pow",
  min: "min",
  max: "max",
  atan2: "atan",
  mod: "mod",
};

const SYMBOLS: Record<string, string> = {
  x: "x",
  z: "z",
  y: "z", // people type y for the second axis
  pi: "3.14159265358979",
  e: "2.71828182845905",
  tau: "6.28318530717959",
};

function num(v: number): string {
  if (!Number.isFinite(v)) throw new Error("non-finite constant");
  const s = v.toString();
  return /[.eE]/.test(s) ? s : `${s}.0`;
}

function emit(node: MathNode): string {
  switch (node.type) {
    case "ConstantNode": {
      const v = (node as unknown as { value: unknown }).value;
      if (typeof v !== "number") throw new Error("unsupported constant");
      return num(v);
    }
    case "SymbolNode": {
      const name = (node as unknown as { name: string }).name;
      const g = SYMBOLS[name];
      if (!g) throw new Error(`unknown symbol "${name}"`);
      return g;
    }
    case "ParenthesisNode":
      return `(${emit((node as unknown as { content: MathNode }).content)})`;
    case "OperatorNode": {
      const n = node as unknown as { op: string; fn: string; args: MathNode[] };
      const [a, b] = n.args;
      if (n.args.length === 1) {
        if (n.fn === "unaryMinus") return `(-${emit(a)})`;
        if (n.fn === "unaryPlus") return emit(a);
        throw new Error(`unsupported unary ${n.op}`);
      }
      const A = emit(a);
      const B = emit(b);
      switch (n.fn) {
        case "add":
          return `(${A} + ${B})`;
        case "subtract":
          return `(${A} - ${B})`;
        case "multiply":
          return `(${A} * ${B})`;
        case "divide":
          return `(${A} / ${B})`;
        case "pow": {
          // integer exponents keep the sign of the base; pow() in GLSL is NaN for x<0
          const bv = (b as unknown as { value?: unknown }).value;
          if (b.type === "ConstantNode" && Number.isInteger(bv) && (bv as number) >= 0 && (bv as number) <= 8) {
            const k = bv as number;
            if (k === 0) return "1.0";
            return `(${Array.from({ length: k }, () => A).join(" * ")})`;
          }
          return `pow(${A}, ${B})`;
        }
        default:
          throw new Error(`unsupported operator ${n.op}`);
      }
    }
    case "FunctionNode": {
      const n = node as unknown as { fn: { name: string }; args: MathNode[] };
      const name = n.fn.name;
      if (n.args.length === 1 && FN1[name]) return `${FN1[name]}(${emit(n.args[0])})`;
      if (n.args.length === 2 && FN2[name]) return `${FN2[name]}(${emit(n.args[0])}, ${emit(n.args[1])})`;
      throw new Error(`unsupported function ${name}/${n.args.length}`);
    }
    default:
      throw new Error(`unsupported node ${node.type}`);
  }
}

export type CompiledCustom = {
  expr: string;
  js: (x: number, z: number) => number;
  glsl: string;
};

/**
 * Compile a user expression into a JS evaluator and a GLSL function body.
 * The result is clamped to keep the surface within view.
 */
export function compileCustom(expr: string): CompiledCustom {
  const trimmed = expr.trim();
  if (!trimmed) throw new Error("empty expression");
  const node = parse(trimmed);
  const glslExpr = emit(node);
  const code = node.compile();
  const js = (x: number, z: number) => {
    const v = code.evaluate({ x, z, y: z }) as unknown;
    const n = typeof v === "number" ? v : Number(v);
    if (!Number.isFinite(n)) return 0;
    return Math.max(-6, Math.min(6, n));
  };
  // probe a few points so obviously broken expressions fail at compile time
  for (const [px, pz] of [
    [0, 0],
    [1, -1],
    [-3, 2],
  ] as const) {
    js(px, pz);
  }
  const glsl = `float v = ${glslExpr}; return clamp(v, -6.0, 6.0);`;
  return { expr: trimmed, js, glsl };
}
