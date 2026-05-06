# Usage Examples for Leitner

## Problem Statement

Leitner ships a compact README snippet showing the API surface, but developers adopting the library have no runnable, copy-pasteable examples that demonstrate real patterns — vanilla DOM rendering, React integration via `useSyncExternalStore`, or handling unmatched routes. Without these, every consumer re-invents the same boilerplate.

## Solution

Add a small `examples/` directory containing two self-contained TypeScript examples (vanilla DOM and React) that demonstrate core Router usage including the 404/null-route fallback. Link to them from a new "Examples" section in the README so they're discoverable.

## User Stories

1. As a developer evaluating Leitner, I want a runnable vanilla TypeScript example so that I can see how `subscribe` and `navigate` drive UI updates without a framework.
2. As a developer evaluating Leitner, I want a React example using `useSyncExternalStore` so that I can see the idiomatic integration pattern before committing to the library.
3. As a developer, I want the examples to demonstrate the `null` (unmatched) Route case so that I understand how to render a 404 fallback.
4. As a developer, I want the examples linked from the README so that I can find them without browsing the repository tree.
5. As a developer reading the examples, I want inline comments explaining each step so that I can understand the code without a separate tutorial document.
6. As a developer, I want the examples written in TypeScript so that I can see the correct type annotations for Router, Route, and RouteDefinition.
7. As a developer, I want the vanilla example to show programmatic `navigate` calls so that I understand how to wire up click handlers.
8. As a developer, I want the React example to show a component that re-renders on route change so that I can apply the same pattern in my own components.
9. As a developer, I want the examples to show `destroy()` cleanup so that I know how to tear down the Router when unmounting.

## Implementation Decisions

- Examples live in `examples/vanilla/` and `examples/react/` at the repository root.
- Each example is a fully runnable standalone web app: its own `package.json`, `index.html`, `vite.config.ts`, and source files. A reader clones the repo, runs `npm install` at the root, then `npm run dev` inside an example folder, and the Vite dev server opens the running app.
- The repo root becomes an npm workspaces root (`"workspaces": ["examples/*"]`) so a single `npm install` at the root installs each example's devDeps. Each example declares `"leitner": "file:../.."` to resolve Leitner via a local symlink (npm 7+ links `file:` deps); the package's `exports` map keeps only `dist/` reachable, so examples consume the same shape a real consumer sees. Note: the workspaces feature itself does not link the workspaces root into its own member packages, so `"leitner": "*"` would fall through to the npm registry — `file:../..` is the standard fix.
- Each example carries a `"predev"` script that runs `npm --prefix ../.. run build` so a single `npm run dev` rebuilds Leitner first and then starts Vite. Readers don't have to remember the order.
- The vanilla example (`examples/vanilla/main.ts`) demonstrates: creating a Router, subscribing to changes, rendering matched Route info into the DOM, handling `null` with a 404 message, calling `navigate` from button click handlers, and calling `destroy` on cleanup. `index.html` contains the buttons (`#nav-home`, `#nav-cards`, `#nav-card-42`, `#nav-missing`) and the `#app` mount point; the TS file attaches handlers.
- The React example consists of three files: a reusable hook (`examples/react/use-router.ts`) wrapping `useSyncExternalStore`, an app component (`examples/react/app.tsx`) that uses the hook to switch between views including a fallback for unmatched routes, and a thin entry (`examples/react/main.tsx`) that calls `ReactDOM.createRoot(...).render(<App/>)`. Keeping the mount in a separate file leaves `app.tsx` focused on Leitner usage rather than React boilerplate.
- The README gains a new "Examples" section (between "API" and "Browser support") with one-liner descriptions linking to each example directory plus a brief run instruction.
- Examples import from `'leitner'` (the package name), not relative paths, to mirror real consumer usage.
- New dev dependencies are added at the example level: `vite` and `typescript` for both, `@vitejs/plugin-react`, `react`, and `react-dom` for the React example. These do not propagate to the published package (`files` in package.json still only includes `dist`).
- The decision to use workspaces over `file:` links, a Vite alias to `src/`, or pinned npm versions is recorded in [ADR 0003](../../docs/adr/0003-runnable-examples.md).

## Testing Decisions

- No automated tests for the example files. They are documentation artifacts, not library code.
- The `prepublishOnly` smoke check is deliberately *not* extended to build the examples. Drift between the examples and the working tree is accepted as a docs problem caught by humans, not a release gate. The reader is the canary.
- Correctness of the patterns is ensured by the existing unit test suite which covers all Router behaviour the examples demonstrate.
- If examples drift out of sync with the API, the fix is a documentation update, not a test failure.

## Out of Scope

- Hosted/deployed live previews (no GitHub Pages workflow, no StackBlitz links). Examples are clone-and-run, not click-a-link.
- Framework adapters beyond the illustrative React hook (Vue, Svelte, Solid, etc.).
- Examples for features outside Tier 1 (query strings, nested routes, guards, loaders).
- Publishing the React hook as part of the package exports.
- Styling. Examples render raw HTML headers and unstyled buttons; the goal is to demonstrate routing, not design.

## Further Notes

- The React hook example intentionally does not ship with the package (`files` in package.json only includes `dist`). It exists solely to demonstrate the integration pattern.
- The `useSyncExternalStore` shape is already satisfied by Router's `get`/`subscribe` pair — the hook is a thin wrapper, reinforcing the library's design decision documented in ADR 0001.
