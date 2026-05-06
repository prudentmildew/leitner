Status: needs-triage

# Convert React example into a runnable Vite app

## Parent

`.scratch/usage-examples/PRD.md` (see [ADR 0003](../../../docs/adr/0003-runnable-examples.md) for the rationale)

## What to build

Make `examples/react/` boot as a standalone web app under the same workspace topology established in `03-runnable-vanilla-vite.md`. A reader runs `npm run dev` inside `examples/react/`, the Leitner build runs first via `predev`, Vite starts, and the browser shows the React app routing between views.

Concretely:

- `examples/react/package.json` declares the example as a private workspace package; depends on `"leitner": "file:../.."`, `react`, and `react-dom`; lists `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, and `@types/react-dom` as devDependencies. Carries the same `"predev": "npm --prefix ../.. run build"` script.
- `examples/react/vite.config.ts` registers `@vitejs/plugin-react`.
- `examples/react/tsconfig.json` configures TypeScript with JSX support compatible with Vite + React.
- `examples/react/index.html` provides a `#root` mount point and loads `main.tsx` as a module script.
- `examples/react/main.tsx` is the new entry: imports `App` from `./app.tsx`, calls `ReactDOM.createRoot(document.getElementById('root')!).render(<App/>)`. Three lines of code plus imports.
- Existing `examples/react/app.tsx` and `examples/react/use-router.ts` are not modified.
- README "Examples" section is extended with a matching React run instruction (or the shared "Run locally" paragraph from issue 03 is generalised to cover both, whichever reads cleaner).

The example imports from `'leitner'` and `'react'` (package names), resolved through the `file:../..` symlink to `dist/` for Leitner and through `node_modules` for React — no Vite alias to source.

## Acceptance criteria

- [x] `examples/react/package.json` exists with `"leitner": "file:../.."`, `react`, `react-dom` as dependencies and the `"predev"` script
- [x] `examples/react/vite.config.ts`, `tsconfig.json`, and `index.html` exist
- [x] `index.html` contains a `#root` element
- [x] `examples/react/main.tsx` exists, imports `App` from `./app.tsx`, and mounts it via `ReactDOM.createRoot`
- [x] `examples/react/app.tsx` and `examples/react/use-router.ts` are unchanged
- [x] After `npm run dev` in `examples/react/`, the app loads in the browser, all four nav buttons navigate, and the unmatched route shows the 404 fallback
- [x] README "Examples" section covers running the React example (the run snippet added in issue 03 already mentions `examples/react`)
- [x] No Vite alias points at the Leitner `src/`; the example resolves `'leitner'` through the package's `exports` map

## Blocked by

- `.scratch/usage-examples/issues/03-runnable-vanilla-vite.md` — the root `"workspaces"` field and install topology must already exist.
