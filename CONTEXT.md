# Leitner

A small TypeScript routing library for client-side single-page applications. The library is the project — Leitner is consumed by other SPAs as a published npm package, not embedded in any one application.

Note: the name overlaps with the Leitner spaced-repetition flashcard system; this project has no relation to that.

## Language

**Leitner**:
This routing library, published as the `leitner` npm package.
_Avoid_: "the router" when ambiguous between the package and a runtime instance.

**Router**:
A runtime instance returned by `createRouter`, holding current route state and exposing `get`, `subscribe`, `navigate`, and `destroy`. One per SPA.
_Avoid_: "the router" when you mean the package itself (use **Leitner**).

**RouteDefinition**:
A static, developer-declared `{ path, name }` pair passed into `createRouter`. Inputs to construction; never mutated at runtime.
_Avoid_: "route" (reserved for the runtime concept), "route config".

**Route**:
The runtime value representing the currently-matched URL: `{ name, params, path }`. Read via `get()` or delivered to `subscribe` callbacks. Distinct from a RouteDefinition.
_Avoid_: "current route definition", "matched config".

**Matcher**:
A pure function pair (compile + match) that turns a path pattern and a URL path into a Route's params (or `null`). No DOM, no state. Internal to the package.

**Validator**:
A pure function that inspects a list of RouteDefinitions and throws on duplicate names, duplicate paths, missing leading slashes, or anonymous `:` params. Runs once at construction. Internal to the package.

**Pattern**:
The string syntax used inside a RouteDefinition's `path`: literal segments and `:param` only. No wildcards or optionals in Tier 1.

**Specificity**:
The ordering used to break matching ties: at any segment position, a literal beats a `:param`. Definition order is the final tiebreaker.

**Tier**:
A scope grouping. Tier 1 is the shippable MVP (matcher, observable state, programmatic navigation, popstate). Tiers 2–4 are deferred work; see PRD for contents.

## Relationships

- **Leitner** exports exactly one user-facing constructor (`createRouter`) and the public types **Route**, **RouteDefinition**, and the **Router** interface.
- A **Router** holds zero or more **RouteDefinitions** at construction; at runtime it exposes a single **Route** (or `null`) reflecting the current URL.
- The **Matcher** turns one **RouteDefinition.path** + one URL into a candidate **Route**.
- The **Validator** runs once over the **RouteDefinition** list at **Router** construction; it never sees a runtime **Route**.
- **Specificity** ordering is applied to **RouteDefinitions** once at construction, not per-navigation.

## Example dialogue

> **Dev:** "When I call `navigate('/cards/42')`, does the **Router** create a new **RouteDefinition**?"
> **Maintainer:** "No — **RouteDefinitions** are static, declared at construction. `navigate` produces a new **Route** (the runtime value) by running the existing definitions through the **Matcher**."
> **Dev:** "And if no definition matches?"
> **Maintainer:** "The **Router**'s state becomes `null`. The **RouteDefinition** list is unchanged."

## Flagged ambiguities

- "route" was used for both the static declaration and the runtime match. Resolved: **RouteDefinition** for the declaration, **Route** for the runtime value.
- "the router" was used for both the package and a runtime instance. Resolved: **Leitner** for the package, **Router** for the instance.
