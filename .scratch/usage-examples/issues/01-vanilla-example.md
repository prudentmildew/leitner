Status: needs-triage

# Add vanilla TypeScript usage example with README link

## Parent

`.scratch/usage-examples/PRD.md`

## What to build

A self-contained vanilla TypeScript example (`examples/vanilla/main.ts`) that demonstrates core Router usage end-to-end: creating a Router with several RouteDefinitions, subscribing to route changes, rendering the current Route into the DOM, handling the `null` (unmatched) case with a 404 fallback, wiring `navigate` calls to click handlers, and calling `destroy` on cleanup. The file uses inline comments to explain each step.

Add an "Examples" section to the README (between "API" and "Browser support") that links to `examples/vanilla/` with a one-liner description.

The example imports from `'leitner'` (the package name) to mirror real consumer usage.

## Acceptance criteria

- [x] `examples/vanilla/main.ts` exists and demonstrates: `createRouter`, `subscribe`, `get`, `navigate`, `destroy`, and the `null` route fallback
- [x] Inline comments explain each significant step
- [x] The file imports from `'leitner'`, not a relative path
- [x] README.md contains a new "Examples" section linking to the vanilla example
- [x] No new dev dependencies are added

## Blocked by

None — can start immediately.
