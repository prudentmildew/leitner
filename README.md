# leitner

A small TypeScript routing library for client-side single-page applications. The current Route is exposed as observable state — `get()` for synchronous reads, `subscribe(fn)` for changes — and programmatic navigation is a single `navigate(path, options?)` call. No runtime dependencies, ESM only, TypeScript types included.

This package is published for personal use across the maintainer's own projects. The shape may evolve while it sits at `0.x`; there are no roadmap commitments and no promise of accepting outside contributions.

## What it isn't

Tier 1 deliberately omits a number of things common in larger routers. They are out of scope here, not on a near-term roadmap:

- No `<a>` link click interception — call `navigate` from your own handlers.
- No query string parsing — `Route.params` only contains `:param` captures.
- No nested or hierarchical routes — RouteDefinitions are a flat list.
- No wildcard / catch-all routes — unmatched URLs set Route to `null`.
- No route guards, redirects, or scroll restoration.
- No data loaders or async route components.
- No React / Vue / Svelte adapter — `subscribe`/`get` is shaped for `useSyncExternalStore`, but the binding is not bundled.
- No SSR support — `window` and `URLPattern` are required at construction time.

## Install

```sh
npm install leitner
```

## Usage

```ts
import { createRouter } from 'leitner';

const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/cards/:id', name: 'card' },
]);

router.get(); // => { name: 'home', params: {}, path: '/' } | null

const unsubscribe = router.subscribe((route) => {
  console.log(route);
});

router.navigate('/cards/42');
// later: router.navigate('/cards/42', { replace: true });

unsubscribe();
router.destroy();
```

## API

`createRouter(routes)` returns a `Router` with four methods:

- `get(): Route | null` — current matched Route, or `null` when nothing matches.
- `subscribe(listener): () => void` — register a listener; returns an unsubscribe function. Does not fire on subscription; prime initial state via `get()`.
- `navigate(path, options?): void` — push a history entry and update Route. Pass `{ replace: true }` to use `replaceState` instead. Same-Route navigations are a no-op.
- `destroy(): void` — remove the `popstate` listener and stop notifying subscribers.

A `Route` is `{ name, params, path }`. `params` is a `Record<string, string>` of `:param` captures, automatically `decodeURIComponent`-ed.

## Examples

- **[Vanilla TypeScript](./examples/vanilla/main.ts)** — Subscribe to route changes, render into the DOM, and handle unmatched URLs with a 404 fallback. No framework required.

## Browser support

Latest 2 versions of Chrome, Firefox, Safari, and Edge. The matcher is built on the platform [`URLPattern`](https://developer.mozilla.org/docs/Web/API/URLPattern) API, which has the hard floor: Chrome 95+, Edge 95+, Safari 26+, Firefox 142+. No polyfill is shipped.

## See also

- [PRD](./.scratch/spa-router/PRD.md) — full Tier 1 specification and out-of-scope items
- [ADR 0001 — public API boundary](./docs/adr/0001-public-api-boundary.md)
- [ADR 0002 — URLPattern matcher](./docs/adr/0002-urlpattern-matcher.md)

## License

MIT
