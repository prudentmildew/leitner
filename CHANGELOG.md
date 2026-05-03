# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). The API shape is considered unstable while the package is at `0.x`.

## [Unreleased]

### Added

- `createRouter(routes)` factory exported from the package entry; returns a Router with `get`, `subscribe`, `navigate`, and `destroy`.
- Public types `Route`, `RouteDefinition`, and `Router`.
- URLPattern-based matcher restricted to literal segments and `:param` captures, with automatic `decodeURIComponent` of captured values.
- Construction-time validation: throws on duplicate names, duplicate paths, paths missing the leading `/`, anonymous `:` parameters, and patterns using URLPattern syntax beyond `:param` (`?`, `*`, `+`, `(`, `{`).
- Specificity-based route ordering so static segments win over `:param` regardless of declaration order.
- History API integration: `pushState` by default, `replaceState` via `navigate(path, { replace: true })`, and `popstate` handling so browser back/forward updates Route.
- Same-Route `navigate` calls are a complete no-op (no history mutation, no subscriber notification).
- Trailing-slash normalization in matched `Route.path` (except for `/`).
- `destroy()` removes the `popstate` listener and stops notifying subscribers.
- Smoke check (`npm run smoke`) gated by `prepublishOnly` to verify the built artifact's exported shape.

## [0.1.0]

Initial release. Entries currently in **Unreleased** will be moved here when the release is tagged.
