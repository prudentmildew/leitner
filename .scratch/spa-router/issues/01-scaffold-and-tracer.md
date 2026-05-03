# Tracer bullet: package scaffold + minimal Router

Status: ready-for-human

## Parent

[../PRD.md](../PRD.md)

## What to build

Stand up the publishable npm package and a minimal Router that proves every layer end-to-end. The library should `npm install`-ably expose a working `createRouter` factory that handles literal-only RouteDefinitions, listens to browser navigation, and notifies subscribers — without any `:param` support yet. Build, types, tests, and the public/internal source split must all be wired up correctly so subsequent slices only add behavior, not infrastructure.

Concrete behaviors:
- Project files: `package.json` (name `leitner`, ESM type, `exports` map locked to `./dist/index.js` only, `files: ["dist", "README.md", "LICENSE"]`, MIT license field), `tsconfig.json` (target ES2020, module ESNext, moduleResolution bundler, strict, declaration + declarationMap + sourceMap, outDir `dist`, rootDir `src`), Vitest config with jsdom environment, `.gitignore` (ignores `dist/`, `node_modules/`), `LICENSE` (MIT).
- Source layout: `src/index.ts` (public entry exporting `createRouter`, `Route`, `RouteDefinition`, `Router`), `src/matcher.ts` (internal: `compile`, `match` — for this slice, literal-segment matching only, no URLPattern yet), `src/validator.ts` (internal: `validate(routes)` covering the easy three checks).
- Router behavior:
  - `createRouter(routes)` constructs synchronously, validates, sorts (trivially for literal-only), reads `window.location.pathname`, computes initial Route, attaches `popstate` listener.
  - `get(): Route | null` returns the current matched Route or `null`.
  - `subscribe(fn)` registers a listener, returns an unsubscribe function. Does NOT fire `fn` on subscription.
  - `navigate(path: string, options?: { replace?: boolean })` updates history (no replace handling required here — accept the option but defer behavior to slice 4) and updates state; subscribers fire only when the resolved Route actually changes.
  - `destroy()` removes the popstate listener; subscribers stop receiving updates.
  - Trailing slash normalized (except root `/`); matching is case-sensitive.
  - `params` is always `{}` in this slice (no `:param` support yet).
- Validator (this slice):
  - Throws on duplicate `name`.
  - Throws on duplicate `path` (after trailing-slash normalization).
  - Throws on `path` not starting with `/`.
- Tests: colocated `*.test.ts` files. Validator and Matcher tested in isolation; Router tested through `createRouter`.

## Acceptance criteria

- [x] `package.json` exists with name `leitner`, type `module`, MIT license, ESM `exports` map gated to the public entry only, and `files` allowlist
- [x] `tsconfig.json` matches the settings above; `npm run build` produces `dist/index.{js,d.ts,js.map}` with no other entry leaking
- [x] Source split into `src/index.ts`, `src/matcher.ts`, `src/validator.ts`
- [x] `createRouter([])` constructs without throwing; `get()` returns `null`; navigation does nothing
- [x] `createRouter([{ path: '/', name: 'home' }])` constructs and `get()` returns `{ name: 'home', params: {}, path: '/' }` when the test loads at `/`
- [x] `navigate('/foo')` to a path matching a literal RouteDefinition updates state, fires subscribers, and pushes history
- [x] `popstate` (back/forward) updates state and fires subscribers
- [x] `subscribe(fn)` returns a function that, when called, removes `fn`; `subscribe` does NOT fire `fn` immediately on subscription
- [x] `destroy()` removes the popstate listener; subscribers no longer receive updates
- [x] Trailing slash normalization: `/cards` and `/cards/` route identically; `/` is preserved as itself
- [x] Case-sensitive matching: `/Cards` and `/cards` are distinct (one matches, the other returns `null` if only one is defined)
- [x] Validator throws synchronously on: duplicate `name`, duplicate `path`, `path` missing leading slash
- [x] Validator unit tests in `src/validator.test.ts` cover each throw case and a happy path
- [x] Matcher unit tests in `src/matcher.test.ts` cover literal matches, trailing-slash normalization, case sensitivity, and no-match → `null`
- [x] Router integration tests in `src/index.test.ts` cover construction, navigate, popstate, subscribe, unsubscribe, destroy
- [x] `npm test` passes with all of the above green
- [x] `dist/index.d.ts` exports types `Route`, `RouteDefinition`, `Router` and the `createRouter` function signature

## Blocked by

None — can start immediately.
