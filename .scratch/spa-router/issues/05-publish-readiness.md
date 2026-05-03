# Publish-readiness

Status: ready-for-human

## Parent

[../PRD.md](../PRD.md)

## What to build

Take the now-feature-complete Tier 1 Router and prepare it for `npm publish`. Add the user-facing docs, the release-time guardrails, and a smoke check that verifies the published artifact actually exposes what the PRD promises. The actual `npm publish` is run by the maintainer outside the agent — this slice produces a state where running it is safe.

Concrete deliverables:
- `README.md`:
  - One-paragraph "what Leitner is" + honest scope note ("personal-use, may evolve, no roadmap commitments").
  - "What it isn't" section listing the explicit out-of-scope items (no link interception, no query parsing, no nested routes, no React adapter — see PRD).
  - Install snippet (`npm install leitner`).
  - Minimal usage example: `createRouter` with two RouteDefinitions, `subscribe`, `navigate`.
  - The four-method API listed compactly: `get`, `subscribe`, `navigate`, `destroy`.
  - Browser support note (latest 2 evergreens; URLPattern requirement).
  - Link to PRD and ADRs in the repo.
- `CHANGELOG.md` in Keep-A-Changelog format with an `Unreleased` section pre-populated with the Tier 1 items, plus an `[0.1.0]` entry stub for the first release.
- `package.json` additions:
  - `"prepublishOnly": "npm run build && npm test && npm run smoke"` — runs the full safety net before publish.
  - `"smoke": "node scripts/smoke.mjs"` (or equivalent) — a tiny script that imports the built `dist/index.js` and asserts `createRouter` is a function and constructing it with one RouteDefinition produces a Router with the four expected methods.
  - Verify `version` is `0.1.0`.
  - Verify `files` is `["dist", "README.md", "LICENSE"]` (already from #01) and `exports` is locked to the public entry only.
- `scripts/smoke.mjs` (or wherever the smoke check lives): Node-only script (jsdom NOT required — it should work as a sanity check that the package's exported shape is correct, gracefully handling the absence of `window` by catching the constructor's expected error if needed, OR by stubbing minimum globals).
- Verify `npm pack --dry-run` output: only `dist/`, `README.md`, `LICENSE`, and `package.json` are in the tarball.

## Acceptance criteria

- [x] `README.md` exists, covers what/what-not, install, minimal example, four-method API, browser support, and links to PRD + both ADRs
- [x] `CHANGELOG.md` exists with `Unreleased` and `[0.1.0]` sections, Keep-A-Changelog format
- [x] `package.json` has `prepublishOnly` running build + test + smoke
- [x] A smoke-check script exists and verifies `createRouter` is exported and produces a Router with `get`, `subscribe`, `navigate`, `destroy` methods of the right type
- [x] Running `npm run prepublishOnly` succeeds locally
- [x] `npm pack --dry-run` shows the tarball contains only `dist/**`, `README.md`, `LICENSE`, and `package.json` — nothing else
- [x] No actual `npm publish` is performed by the agent
- [x] Existing test suite still green; `npm test` passes
- [x] `package.json` `version` is `0.1.0`

## Blocked by

- Blocked by #01 (scaffold and tracer)
- Blocked by #02 (`:param` extraction via URLPattern)
- Blocked by #03 (specificity ordering)
- Blocked by #04 (navigation polish)
