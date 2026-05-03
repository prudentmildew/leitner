# Use the platform URLPattern API for matching

The original PRD called for a hand-rolled matcher on the grounds that URLPattern was too new — specifically not yet present in the latest two Firefox versions. By the time this decision was revisited (May 2026), URLPattern had reached Baseline Newly available status (Chrome/Edge 95+, Safari 26+ since September 2025, Firefox 142+ since August 2025), placing it solidly inside the "latest 2 evergreens" support window the project already commits to.

Decision: build the Matcher on `URLPattern`. Each RouteDefinition is compiled to one `URLPattern({ pathname })` at construction time and `exec` is called per navigation. The consumer-facing pattern syntax is deliberately restricted to a strict subset of what URLPattern accepts — literal segments and `:param` only — and the Validator throws on any pattern containing `?`, `*`, `+`, `(`, or `{`.

This removes ~50 lines of hand-rolled pattern code, avoids re-implementing well-tested platform behavior, and keeps the option to promote URLPattern's richer syntax (wildcards, optionals, regex segments) into Tier 2 or Tier 3 as deliberate, documented features later. Restricting now and opening later is non-breaking; the reverse is not.
