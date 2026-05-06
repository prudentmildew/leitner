Status: needs-triage

# Convert vanilla example into a runnable Vite app and introduce npm workspaces

## Parent

`.scratch/usage-examples/PRD.md` (see [ADR 0003](../../../docs/adr/0003-runnable-examples.md) for the rationale)

## What to build

Make `examples/vanilla/` boot as a standalone web app. A reader clones the repo, runs `npm install` at the root, then `npm run dev` inside `examples/vanilla/`, and the Vite dev server opens the working app in their browser.

Concretely:

- Root `package.json` gains `"workspaces": ["examples/*"]`. `package-lock.json` is re-resolved.
- `examples/vanilla/package.json` declares the example as a private workspace package, depends on `"leitner": "file:../.."` (npm 7+ links this as a symlink to the repo root; the root's `exports` map keeps only `dist/` reachable), and lists `vite` and `typescript` as devDependencies.
- A `"predev": "npm --prefix ../.. run build"` script runs the Leitner build before Vite starts so a single `npm run dev` is enough.
- `examples/vanilla/vite.config.ts` is a minimal default Vite config.
- `examples/vanilla/tsconfig.json` configures TypeScript for the example (module/target compatible with Vite, DOM lib).
- `examples/vanilla/index.html` provides the `#app` mount point and the four nav buttons the existing `main.ts` already references (`#nav-home`, `#nav-cards`, `#nav-card-42`, `#nav-missing`), and loads `main.ts` as a module script.
- The existing `examples/vanilla/main.ts` is not modified.
- README "Examples" section gains a brief "Run locally" instruction (`npm install` at root, then `npm run dev` inside the example folder).

The example imports from `'leitner'` (the package name), resolved via the `file:../..` symlink to the package's `dist/` exports — no Vite alias to source.

## Acceptance criteria

- [x] Root `package.json` declares `"workspaces": ["examples/*"]`
- [x] `examples/vanilla/package.json` exists with `"leitner": "file:../.."` as a dependency and a `"predev"` script that builds the root package
- [x] `examples/vanilla/vite.config.ts`, `tsconfig.json`, and `index.html` exist
- [x] `index.html` contains the `#app` element and the four nav buttons referenced by `main.ts`
- [x] `examples/vanilla/main.ts` is unchanged
- [x] After `npm install` at root and `npm run dev` in `examples/vanilla/`, the app loads in the browser, all four buttons navigate, and the unmatched route shows the 404 message
- [x] README "Examples" section includes a one-paragraph run instruction
- [x] No Vite alias points at `src/`; the example resolves `'leitner'` through the package's `exports` map

## Blocked by

None — can start immediately.
