# Navigation semantics polish

Status: ready-for-human

## Parent

[../PRD.md](../PRD.md)

## What to build

Implement the three navigation semantics that go beyond the bare "push history + match" loop from slice 1: the `replace` flag, the same-URL no-op, and the unmatched-path → null behavior. These complete the navigation contract documented in the PRD.

Concrete behaviors:
- `navigate(path, { replace: true })` calls `history.replaceState` instead of `history.pushState`. State updates and subscriber notifications proceed as normal.
- Same-URL no-op: when `navigate(path)` resolves to a Route deep-equal to the current Route (compare on `name` and `params`), do nothing — no history mutation, no subscriber notification. Use a deep equality comparison; the Route's `path` field can differ (e.g. trailing slash) without affecting equality, so equality must compare `name` and `params` only.
- Unmatched path: when `navigate(path)` resolves to no RouteDefinition, still call `history.pushState` (or `replaceState` if requested), set the Router's state to `null`, and notify subscribers exactly once.
- popstate handling carries the same semantics: navigating via the browser back/forward buttons to an unmatched URL sets state to `null` and fires subscribers; navigating to a same-as-current URL fires nothing.

## Acceptance criteria

- [x] `navigate('/foo', { replace: true })` does not increase `history.length`; subsequent back button does not return to the pre-navigate URL
- [x] `navigate('/foo', { replace: true })` still updates state and fires subscribers
- [x] `navigate('/cards/42')` while already at the resolved-equivalent Route is a complete no-op: history length unchanged, no subscriber notifications
- [x] Same-URL no-op equality compares `name` and `params` only; calling `navigate('/cards/42')` then `navigate('/cards/42/')` (trailing slash variant resolving to same Route) is a no-op the second time
- [x] `navigate('/totally-bogus')` against a Router with no catch-all RouteDefinition: history is updated, state becomes `null`, subscribers fire once
- [x] Subsequent `navigate('/totally-bogus')` from the unmatched state is a no-op (state is already `null`)
- [x] popstate to an unmatched URL: state becomes `null`, subscribers fire once
- [x] popstate to a same-as-current resolved Route: subscribers do not fire
- [x] Tests for each behavior are in `src/index.test.ts`
- [x] Existing tests still pass; `npm test` is green

## Blocked by

- Blocked by #02 (`:param` extraction via URLPattern)
