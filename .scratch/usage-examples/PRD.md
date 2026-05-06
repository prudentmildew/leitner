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
- Each example is a single TypeScript file with inline comments — no bundler config, no package.json, no build step.
- The vanilla example (`examples/vanilla/main.ts`) demonstrates: creating a Router, subscribing to changes, rendering matched Route info into the DOM, handling `null` with a 404 message, calling `navigate` from button click handlers, and calling `destroy` on cleanup.
- The React example consists of two files: a reusable hook (`examples/react/use-router.ts`) wrapping `useSyncExternalStore`, and an app component (`examples/react/app.tsx`) that uses the hook to switch between views including a fallback for unmatched routes.
- The README gains a new "Examples" section (between "API" and "Browser support") with one-liner descriptions linking to each example directory.
- Examples import from `'leitner'` (the package name), not relative paths, to mirror real consumer usage.
- No new dev dependencies are added for the examples — they are illustrative, not executable in the repo itself.

## Testing Decisions

- No automated tests for the example files. They are documentation artifacts, not library code.
- Correctness of the patterns is ensured by the existing unit test suite which covers all Router behaviour the examples demonstrate.
- If examples drift out of sync with the API, the fix is a documentation update, not a test failure.

## Out of Scope

- Runnable dev server or build tooling for the examples (consumers bring their own bundler).
- Framework adapters beyond the illustrative React hook (Vue, Svelte, Solid, etc.).
- Examples for features outside Tier 1 (query strings, nested routes, guards, loaders).
- Publishing the React hook as part of the package exports.

## Further Notes

- The React hook example intentionally does not ship with the package (`files` in package.json only includes `dist`). It exists solely to demonstrate the integration pattern.
- The `useSyncExternalStore` shape is already satisfied by Router's `get`/`subscribe` pair — the hook is a thin wrapper, reinforcing the library's design decision documented in ADR 0001.
