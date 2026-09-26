# ar5entum.vercel.app

Personal site of Astitva Jaiswal. The whole thing is built around a live loss
landscape: a GPU-rendered surface with optimizer particles (SGD, Momentum,
Nesterov, Adagrad, RMSProp, Adam) descending it in real time.

- `/` — home. The surface morphs between test functions as you scroll.
- `/descent` — the playground: race optimizers, pick a surface or type your own `f(x, z)`, share the URL.
- `/work/captionbench` — case study.

## Stack

Next.js (App Router) · React Three Fiber + custom GLSL · Motion · Lenis · Tailwind v4 · mathjs (custom formulas are compiled to both JS and GLSL).

## Develop

```
npm install
npm run dev
```

Content lives in `src/content/*.ts`. The landscape engine is `src/lib/landscape/`
(presets, optimizers, mathjs→GLSL translator, scene store) and the scene itself
is `src/components/scene/`.

## Deploy

Vercel, framework preset **Next.js**, no output-directory override.
