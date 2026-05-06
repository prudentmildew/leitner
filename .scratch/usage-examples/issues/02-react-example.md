Status: needs-triage

# Add React useSyncExternalStore usage example with README link

## Parent

`.scratch/usage-examples/PRD.md`

## What to build

A React integration example in `examples/react/` consisting of two files:

1. `examples/react/use-router.ts` — a thin hook wrapping Router's `get`/`subscribe` with `useSyncExternalStore`, demonstrating that the Router interface is already shaped for React's external store contract.
2. `examples/react/app.tsx` — a small React component tree that uses the hook to switch between views based on the current Route, including a 404 fallback when Route is `null`.

Both files use inline comments to explain each step and import from `'leitner'` (the package name).

Add a link to `examples/react/` in the README "Examples" section (create the section if it doesn't already exist from a prior issue).

## Acceptance criteria

- [x] `examples/react/use-router.ts` exists and wraps `useSyncExternalStore` around a Router instance
- [x] `examples/react/app.tsx` exists and renders different views per route, including a `null` fallback
- [x] Inline comments explain each significant step
- [x] Files import from `'leitner'` and `'react'`, not relative paths
- [x] README.md "Examples" section links to the React example
- [x] No new dev dependencies are added to the library's package.json

## Blocked by

None — can start immediately.
