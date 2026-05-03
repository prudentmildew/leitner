# Split source files behind a closed `exports` map

The original Tier 1 design called for a single source file. That made sense when Leitner was scoped as an in-repo folder inside a single application: every export was already private to that app. Once we decided to publish Leitner as an npm package, anything reachable from the entry file became part of the public API surface — including the matcher and validator helpers, which exist primarily for isolated testing.

Decision: keep the public entry (`src/index.ts`) narrow — only `createRouter` and the public types — and put internal helpers in sibling modules (`src/matcher.ts`, `src/validator.ts`). Lock consumer access to the public entry only via `package.json` `"exports": { ".": "./dist/index.js" }`. Tests import internals directly from source; consumers cannot.

This costs a small amount of single-file readability but gives a clean, semver-bound public surface and lets internals be refactored without breaking consumers.
