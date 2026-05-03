# PRD: Leitner — Tier 1 Routing Library

Status: ready-for-agent

## Problem Statement

I build small client-side single-page applications and want a reusable routing library to share across them. Existing options (React Router, TanStack Router, Vue Router, etc.) carry features and abstractions far beyond what these apps need — data loaders, nested layouts, transition orchestration, framework lock-in. Adopting any of them means a runtime dependency, a learning surface, and a footprint that competes with the apps themselves. The goal is a small, readable routing library I can publish once, install across my projects, and read end-to-end in a single sitting, with zero runtime dependencies.

## Solution

Leitner is a TypeScript routing library published to public npm as `leitner`. Consumers `npm install leitner` and call `createRouter(routeDefinitions)` to get a Router whose current matched Route is exposed as observable state — `get()` for synchronous reads, `subscribe(fn)` for change notifications. Programmatic navigation is a single `navigate(path, options?)` call. Browser back/forward buttons work without consumer wiring. The package targets evergreen browsers, ships ESM only with TypeScript declarations, and has no runtime dependencies. A React adapter is explicitly out of scope for this PRD; the `subscribe`/`get` contract is shaped so a future adapter can be a tiny opt-in layer.

## User Stories

1. As a developer starting a new SPA, I want to `npm install leitner` and import a single `createRouter` factory, so that I get routing in the first commit without learning a framework.
2. As a developer using Leitner, I want zero runtime dependencies in my dependency graph, so that audits and bundle size stay clean.
3. As a developer using Leitner, I want TypeScript types out of the box, so that I get autocomplete and basic type-safety without adding `@types/...`.
4. As a developer using Leitner, I want ES module output, so that the package works seamlessly with modern bundlers (Vite, esbuild, Webpack 5, Bun).
5. As a developer using Leitner, I want SemVer discipline (0.x while shape settles, 1.x once stable), so that `^x.y.z` upgrades behave predictably.
6. As a developer using Leitner, I want a small, documented public API (one factory plus four methods), so that I can read the entire library surface in one sitting.
7. As a developer using Leitner, I want internal helpers to be unreachable from the package entry, so that I don't accidentally depend on unstable internals.
8. As a developer using Leitner, I want to define routes as a flat list of `{path, name}` pairs, so that route configuration is obvious from a single place.
9. As a developer using Leitner, I want path parameters extracted from `:id`-style placeholders, so that I can read identifiers without parsing URL strings.
10. As a developer using Leitner, I want to read the current Route synchronously at any time, so that non-reactive code can branch on what's currently rendered.
11. As a developer using Leitner, I want to subscribe to Route changes, so that reactive views can re-render when navigation occurs.
12. As a developer using Leitner, I want unsubscribing to be straightforward, so that cleanup in tests and components is correct.
13. As a developer using Leitner, I want to navigate programmatically from event handlers, so that I can move the user after actions like save/login.
14. As a developer using Leitner, I want a `replace` option when navigating, so that redirects don't bloat the history stack.
15. As a developer using Leitner, I want static segments (`/cards/new`) to take precedence over parameterized segments (`/cards/:id`) regardless of declaration order, so that I'm not silently broken by reordering RouteDefinitions.
16. As a developer using Leitner, I want the Router to throw at construction time when RouteDefinitions are malformed (duplicate names, duplicate paths, missing leading slash, anonymous `:` params), so that bugs surface immediately on app boot rather than during navigation.
17. As a developer using Leitner, I want path parameters automatically `decodeURIComponent`-ed, so that I get logical values rather than URL-encoded noise.
18. As a developer using Leitner, I want navigating to an unmatched URL to set the Route state to `null` rather than throw, so that I can render a "not found" view consistently with what a fresh page load to the same URL would show.
19. As a developer using Leitner, I want a `destroy()` method that removes the Router's `popstate` listener, so that test setups and HMR work cleanly.
20. As a developer using Leitner, I want the matcher to be testable (in *Leitner's* tests) as pure functions, so that pattern semantics are verified without booting a DOM.
21. As a developer using Leitner, I want trailing slashes to be normalized, so that `/cards` and `/cards/` don't accidentally diverge.
22. As a developer using Leitner, I want case-sensitive matching, so that `/Cards` and `/cards` are treated as distinct (matching how URLs are conventionally treated).
23. As a developer using Leitner, I want RouteDefinition name collisions to throw, so that my downstream `route.name === 'card'` checks remain unambiguous.
24. As a developer using Leitner in tests, I want to construct a Router, navigate to URLs, and inspect state synchronously, so that I don't need elaborate test harnesses for my own components.
25. As a developer using Leitner, I want the Router not to fire subscribers on construction, so that I can prime initial state with `get()` and avoid "double-render" patterns.
26. As a developer using Leitner, I want navigating to a malformed percent-encoded URL to result in no-match (state `null`) rather than a thrown exception, so that bad inbound links don't crash my app.
27. As a developer adopting React in a future project, I want Leitner's `subscribe`/`get` contract to match `useSyncExternalStore`, so that a React adapter is a one-liner without redesigning the core.
28. As a user of an SPA built with Leitner, I want shareable URLs that link directly to specific app states, so that I can bookmark and send links.
29. As a user of an SPA built with Leitner, I want the browser back button to take me to the previous view, so that navigation feels native.
30. As a user of an SPA built with Leitner, I want the browser forward button to work after going back, so that I can revisit views I retreated from.
31. As a user of an SPA built with Leitner, I want clean URLs without a hash fragment, so that links look professional and work with link-preview tools.
32. As a user of an SPA built with Leitner, I want non-ASCII characters in URLs to display and route correctly, so that the app works for content beyond English.
33. As a user of an SPA built with Leitner, I want pressing the back button after a redirect to NOT bounce me back to the redirect-source URL, so that history feels coherent.
34. As a user of an SPA built with Leitner, I want clicking the same nav link twice in a row to be a no-op rather than polluting history, so that the back button doesn't have phantom entries.
35. As Leitner's maintainer, I want a single `npm publish` to build, test, and ship a release, so that publishing is one command and forgetting to build is impossible.

## Implementation Decisions

**Project identity**
- Leitner *is* the published library. The repository contains only the library source, tests, build config, and docs — there is no consuming application here.
- See [CONTEXT.md](../../CONTEXT.md) for the bounded vocabulary (Leitner, Router, RouteDefinition, Route, Matcher, Validator, Pattern, Specificity, Tier).

**Distribution and licensing**
- Published to public npm under the unscoped name `leitner`.
- License: MIT.
- Audience: personal-only — published for the maintainer's own cross-project install/upgrade story; open contributions and roadmap commitments are not promised.
- SemVer: 0.x while the API shape is being validated by real consuming projects; 1.0 once two real apps have used it without wanting to break the surface.

**Module format and types**
- ESM only. No CJS dual build, no UMD bundle.
- Output: `dist/index.js` (ES2020 ESM), `dist/index.d.ts`, `dist/index.js.map`.
- `package.json` `"exports"` is a closed map exposing exactly one entry: `"."` → `dist/index.js` (with corresponding `types`). Internal modules in `dist/` exist but are unreachable through the package name.
- `package.json` `"files": ["dist", "README.md", "LICENSE"]` so new repo-root files never accidentally leak into the published tarball.

**Build pipeline**
- `tsc` only — no bundler.
- `tsconfig.json` settings: `target: ES2020`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`, `declaration: true`, `declarationMap: true`, `sourceMap: true`, `outDir: dist`, `rootDir: src`. Test files excluded.
- `prepublishOnly` script runs `npm run build && npm test` so that `npm publish` cannot ship an unbuilt or untested artifact.

**Repository layout**
```
leitner/
├── src/
│   ├── index.ts            ← public entry: createRouter + public types only
│   ├── matcher.ts          ← internal: pattern compile + match (pure)
│   ├── validator.ts        ← internal: definition list validation (pure)
│   ├── index.test.ts       ← public-API tests, colocated
│   ├── matcher.test.ts     ← matcher unit tests, colocated
│   └── validator.test.ts   ← validator unit tests, colocated
├── dist/                   ← gitignored, npm-published
├── docs/adr/               ← architecture decision records
├── CONTEXT.md              ← bounded vocabulary
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── CHANGELOG.md
└── .gitignore
```
The public-vs-internal split is recorded in [docs/adr/0001-public-api-boundary.md](../../docs/adr/0001-public-api-boundary.md).

**Mental model**
- State-based: the current Route is a single observable value, not a callback dispatcher. Consumers read state and decide how to render.

**RouteDefinition**
- A RouteDefinition is `{ path: string; name: string }`, both required.
- Pattern syntax: literal segments and `:param` only. No optional params, no wildcards, no regex syntax in Tier 1.
- Trailing slashes are normalized (so `/cards` and `/cards/` are the same RouteDefinition, except for the root `/`).
- Matching is case-sensitive.

**Matching**
- The Matcher is built on the platform `URLPattern` API. Each RouteDefinition is compiled to a `URLPattern({ pathname })` once at Router construction time and stored alongside its definition; per-navigation work is just `URLPattern.exec`.
- Although URLPattern's syntax is a superset of what Tier 1 promises (it supports `:param?`, `:param*`, `:param+`, `*`, regex segments, `{...}` groups), the public surface is restricted to literal segments and `:param` only. The Validator rejects any pattern that contains `?`, `*`, `+`, `(`, or `{`. Promoting any of those to Tier 1 syntax later is non-breaking; demoting would be breaking, so we restrict by default.
- RouteDefinitions are sorted by Specificity at construction. Specificity is computed from the original *string* pattern (URLPattern itself has no specificity API): at each segment position, a literal beats a `:param`. Definition order is the tiebreaker.
- After `URLPattern.exec` returns, captured groups are passed through `decodeURIComponent`; if decoding throws (malformed `%`), the match is treated as `null`.
- When no RouteDefinition matches, the current Route is `null`.

**Validation**
- The Router throws synchronously at construction time when:
  - Two RouteDefinitions share a `name`.
  - Two RouteDefinitions share a `path`.
  - A `path` does not start with `/`.
  - A `path` contains an empty/anonymous `:` parameter.
  - A `path` uses URLPattern syntax beyond literal segments and `:param` (i.e., contains `?`, `*`, `+`, `(`, or `{`).
- If `new URLPattern(...)` itself throws on a pattern that slipped past the above checks, the Router re-throws with the offending `path` and the original message wrapped in.
- An empty RouteDefinitions array is allowed (Router permanently in `null` state).

**Public API surface (the `exports` entry)**
- `createRouter(routes: RouteDefinition[]): Router` — the only exported function.
- The Router has `get()`, `subscribe(fn)` (returns an unsubscribe function), `navigate(path, options?)`, and `destroy()`.
- Types `Route`, `RouteDefinition`, and `Router` are exported as types.
- The Matcher and Validator are NOT exported from the public entry — they live in sibling internal modules and are imported only by tests.

**Route shape**
- `Route = { name: string; params: Record<string, string>; path: string }`.
- `params` is loosely typed as a string-to-string map for Tier 1 (no template-literal-driven type inference).
- The full state read by consumers is `Route | null`.

**Navigation semantics**
- `navigate(path)` defaults to `pushState`; `navigate(path, { replace: true })` uses `replaceState`.
- Navigating to a path that resolves to the same Route (deep-equal on `name` and `params`) is a complete no-op: no history mutation, no subscriber notification.
- Navigating to a path that matches no RouteDefinition still mutates history; state becomes `null` and subscribers are notified once.
- The Router does NOT encode the path string passed to `navigate`. Callers are responsible for `encodeURIComponent` on dynamic segments. (A future Tier 3 `urlFor(name, params)` builder will encode automatically.)

**History strategy**
- History API only (`pushState` / `replaceState` / `popstate`). No hash mode. No configurable strategy.

**Lifecycle**
- The Router auto-starts on construction: it reads `window.location`, computes the initial Route, and attaches a `popstate` listener.
- `destroy()` removes the `popstate` listener and stops notifying subscribers.
- Construction has hard requirements on a browser-like environment (`window`, `history`, `addEventListener`); environments without these (raw Node) are not supported.

**Subscription contract**
- `subscribe(fn)` does NOT fire `fn` immediately with the current state. Initial value is read via `get()`.
- `subscribe` returns an `unsubscribe` function.
- The contract is `useSyncExternalStore`-compatible by design.

**Browser support**
- Latest 2 versions of Chrome, Firefox, Safari, and Edge.
- Hard floor required by URLPattern adoption: Chrome 95+, Edge 95+, Safari 26+, Firefox 142+. All four are inside "latest 2" as of this PRD; URLPattern reached Baseline Newly available in September 2025.
- Output is ES2020+ ESM. No transpilation for older targets. No URLPattern polyfill — that would be a runtime dependency.
- No runtime feature detection; if the platform lacks the History API or URLPattern, the page is expected to break.

**Conceptual modules (mapping to source files)**
1. **Matcher** — `src/matcher.ts`, pure. Two named exports:
   - `compile(path: string): URLPattern` — validates `:param`-only syntax (throws on extended URLPattern syntax) and returns a constructed `URLPattern`.
   - `match(pattern: URLPattern, path: string): Record<string, string> | null` — runs `pattern.exec({ pathname })`, decodes captured groups, returns `null` on no-match or decode failure.
2. **Specificity sorter** — lives in `src/index.ts` (small enough not to warrant its own file): pure, orders RouteDefinition list so static segments win, operating on the original string patterns.
3. **Validator** — `src/validator.ts`, pure: enforces the five construction-time errors (name uniqueness, path uniqueness, leading slash, anonymous `:`, extended-syntax rejection).
4. **Observable store** — lives in `src/index.ts`: generic single-value state with `get`/`subscribe`/`notify` and deep-equality change detection.
5. **Router orchestrator** — `src/index.ts`: composes 1–4 with `window.history` and `popstate`; exposes the public API.

**Publishing flow**
- Manual: bump version in `package.json`, update `CHANGELOG.md`, `git commit`, `git tag vX.Y.Z`, `npm publish`.
- `prepublishOnly` runs the build and the test suite. Releases that don't build or don't pass tests cannot be published.
- No CI publish automation in v0.x; revisit if release cadence picks up.

## Testing Decisions

**What makes a good test:** tests assert observable, externally-visible behavior of a module — inputs and outputs, never internal state or call sequences. Tests should remain green through any refactor that preserves the public contract. They should be deterministic, fast, and free of test-order coupling. A test that breaks when an internal helper is renamed is a bad test.

**Test runner:** Vitest with jsdom for DOM emulation. Both are dev dependencies only — they do not violate the no-runtime-dependencies constraint of the published package.

**Modules tested in isolation** (via direct import from internal files in `src/`, not through the package's public entry):
- **Matcher.** Pure function tests covering: `compile` accepts literal and `:param`-only patterns; `compile` throws on each of `?`, `*`, `+`, `(`, `{` in the input; `match` captures literal segments matching exactly; `match` captures `:param` values; multi-param patterns; trailing slash normalization on both pattern and path; case-sensitive mismatch; non-match returns `null`; percent-decoding of captured params; malformed percent-encoding returns `null`; empty path / root path edge cases.
- **Validator.** Pure function tests covering: duplicate names throw; duplicate paths throw; pattern missing leading slash throws; pattern with anonymous `:` throws; pattern with extended URLPattern syntax throws; valid input does not throw; empty array does not throw.

**Modules tested through the public API (`createRouter`):**
- **Specificity sorter** — verified indirectly by asserting that a Router with a static and a parameterized RouteDefinition at the same depth dispatches to the static one regardless of declaration order.
- **Observable store** — verified indirectly by asserting that subscribers receive notifications on Route change and not on no-op navigations.
- **Router orchestrator** — covers construction matching the current `window.location`; `navigate(path)` updating Route and history; `navigate(path, { replace: true })` not adding to history; `popstate` (back/forward) updating Route; same-URL navigation being a no-op for both history and subscribers; navigation to an unmatched path setting Route to `null`; `destroy()` halting further updates.

**Package-shape verification:** at minimum, a smoke check that the built `dist/index.js` exports `createRouter` and that `dist/index.d.ts` resolves the documented types. Implementation may be a tiny script run from `prepublishOnly` rather than a Vitest test.

**Prior art:** the project is greenfield — no existing tests. Test style is set here: tiny, table-driven where appropriate, with each test asserting one observable fact.

## Out of Scope

The following are explicitly NOT part of this PRD. Each will be evaluated separately if real friction emerges from omitting it.

**Tier 2 (next likely additions):**
- `<a>` link click interception
- Query string parsing and inclusion in Route state
- Wildcard / catch-all RouteDefinitions for explicit 404 handling
- Hash-mode routing as an alternative strategy

**Tier 3 (deferred until real demand):**
- Route guards and redirect declarations
- Nested / hierarchical RouteDefinitions
- A named-route URL builder (`urlFor(name, params)`) with automatic encoding
- Scroll restoration on navigation

**Tier 4 (probably never):**
- Lazy / async route components
- Transition animations between routes
- Data loaders / route-level data fetching
- Type-level path-parameter inference from string literals

**Other deliberate omissions:**
- Framework bindings (React, Vue, Svelte, Solid) — to be added as separate, opt-in adapter packages, not bundled with `leitner`.
- Server-side rendering support — Leitner requires `window` and is browser-only.
- Configurable basename / app-mounted-at-non-root support.
- Runtime feature detection or graceful degradation for older browsers.
- Custom matcher plugins or extensible pattern syntax.
- Dual ESM/CJS build, UMD bundle, or `<script>` tag distribution.
- Automated release pipeline (CI publish on tag).

## Further Notes

- The Matcher uses the platform `URLPattern` API rather than a hand-rolled implementation. URLPattern reached Baseline Newly available in September 2025 (Chrome/Edge 95+, Safari 26+, Firefox 142+) and is solidly inside "latest 2 versions" of all evergreens by this PRD's date. Adopting the platform API removes ~50 lines of pattern-matching code and avoids re-implementing well-tested behavior.
- The Tier 1 syntax is restricted to a small subset of what URLPattern accepts (literal + `:param` only) by an explicit rejection in the Validator. This preserves the option to promote URLPattern's other features (`*`, `:param?`, regex segments) into Tier 2/3 later as deliberate, documented additions rather than emergent surface.
- The decision to split source into `index.ts` + sibling internal files (rather than a single file) is recorded in [docs/adr/0001-public-api-boundary.md](../../docs/adr/0001-public-api-boundary.md). The driver was the move from "in-repo folder" to "published package": once the entry file is the package boundary, anything reachable from it is part of the public API and hard to remove later.
- The "no immediate-fire on subscribe" choice is deliberately aligned with React's `useSyncExternalStore`. If that ever feels awkward in practice for vanilla consumers, a thin helper (`subscribeAndPrime(fn)`) can be added without changing the core contract.
- Leitner's name overlaps with the well-known Leitner spaced-repetition flashcard system. This project is unrelated.
