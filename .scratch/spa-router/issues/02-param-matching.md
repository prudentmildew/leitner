# `:param` extraction via URLPattern

Status: needs-triage

## Parent

[../PRD.md](../PRD.md)

## What to build

Replace the literal-only Matcher from slice 1 with a `URLPattern`-backed implementation that supports `:param` capture, while keeping the consumer-facing syntax restricted to literal segments and `:param` only. The Validator gains the rejection rules that protect this restriction. Captured params are decoded through `decodeURIComponent`; malformed encoding gracefully falls back to no-match instead of crashing.

Concrete behaviors:
- `compile(path: string): URLPattern` in `src/matcher.ts`:
  - Throws `RangeError` if the pattern contains any of `?`, `*`, `+`, `(`, `{`.
  - Otherwise returns `new URLPattern({ pathname: normalizedPath })`.
  - Wraps URLPattern's own constructor errors with the offending path string.
- `match(pattern: URLPattern, path: string): Record<string, string> | null` in `src/matcher.ts`:
  - Calls `pattern.exec({ pathname: normalizedPath })`.
  - Returns `null` if exec returns `null`.
  - For each captured group, runs `decodeURIComponent`; if any decode throws, returns `null`.
  - Returns a `Record<string, string>` of decoded params (skip undefined groups).
- Validator (in addition to slice 1's three checks):
  - Throws on `path` containing an empty/anonymous `:` parameter (e.g. `/cards/:` or `/cards/:/foo`).
  - Throws on `path` containing extended URLPattern syntax (`?`, `*`, `+`, `(`, `{`).
- Router orchestrator: replace the slice-1 literal compare with `compile`-once-at-construction + `match` per navigation. Each RouteDefinition gets a `URLPattern` instance held alongside it.
- Route shape: `{ name, params, path }` where `params` now reflects captured values.

## Acceptance criteria

- [ ] Matcher unit tests cover: literal patterns still work; single `:id` capture; multi-param patterns (`/decks/:deckId/cards/:cardId`); each of `?`, `*`, `+`, `(`, `{` causes `compile` to throw
- [ ] Matcher unit tests cover decoding: `/cards/Hello%20World` against `/cards/:id` yields `params.id === 'Hello World'`
- [ ] Matcher unit tests cover non-ASCII: a percent-encoded UTF-8 sequence decodes correctly
- [ ] Matcher unit tests cover malformed: a path with a lone `%` or invalid hex returns `null` instead of throwing
- [ ] Validator throws on `/cards/:` and on `/cards/:/foo` (anonymous `:`)
- [ ] Validator throws on each of `/cards/:id?`, `/files/*`, `/files/:rest+`, `/cards/(.*)`, and `/cards/{id}`
- [ ] Validator happy path still passes for slice-1 literal patterns
- [ ] Router constructed with `[{ path: '/cards/:id', name: 'card' }]` and a navigation to `/cards/42` produces a Route with `name === 'card'` and `params.id === '42'`
- [ ] Constructing the Router compiles each pattern exactly once (verify by counting calls or by ensuring runtime cost is per-construction, not per-navigation)
- [ ] Existing slice-1 tests still pass unchanged
- [ ] `npm test` is green

## Blocked by

- Blocked by #01 (scaffold and tracer)
