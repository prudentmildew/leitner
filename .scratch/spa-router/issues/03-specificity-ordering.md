# Specificity ordering

Status: needs-triage

## Parent

[../PRD.md](../PRD.md)

## What to build

Sort RouteDefinitions at Router construction so that, when two patterns could match the same path, the more specific one wins. Specificity is computed from the original pattern *string* (URLPattern itself has no specificity API): at each segment position, a literal segment beats a `:param` segment. Definition order is the final tiebreaker. The sort runs once at construction; per-navigation matching is unaffected.

Concrete behaviors:
- A small pure function in `src/index.ts` (or its own internal module if it grows) takes the validated RouteDefinition list and returns a stable-sorted copy. Implementation walks each pair's segments left-to-right; the first position where one is literal and the other is `:param` decides the order. If they remain comparable through all positions (same literal/param shape), preserve original order.
- Patterns of different segment counts compare as-is — segment count is part of how `URLPattern.exec` discriminates, so the sort doesn't need to handle this; it only needs to disambiguate same-shape, same-depth patterns.
- The sorted list replaces the input order in the Router; matching iterates the sorted list and returns on first hit.

## Acceptance criteria

- [ ] An internal `sortBySpecificity(routes)` function exists, is pure, and returns a new array (does not mutate input)
- [ ] Unit tests cover: `/cards/new` ranks before `/cards/:id`; declaration order is irrelevant to that outcome
- [ ] Unit tests cover: two equally-specific patterns (e.g. `/cards/:id` and `/users/:id`) preserve declaration order
- [ ] Unit tests cover: deeper static-vs-param distinctions (e.g. `/a/b/c` vs `/a/:x/c` vs `/a/b/:y` vs `/a/:x/:y`)
- [ ] Integration test through `createRouter`: declaring `[{path: '/cards/:id', name: 'card'}, {path: '/cards/new', name: 'cardNew'}]` and navigating to `/cards/new` resolves to `name === 'cardNew'`
- [ ] Existing tests from #01 and #02 still pass
- [ ] `npm test` is green

## Blocked by

- Blocked by #02 (`:param` extraction via URLPattern)
