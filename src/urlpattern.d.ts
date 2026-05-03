// Minimal ambient declaration for the platform URLPattern API.
// TypeScript's lib.dom.d.ts has not yet shipped URLPattern types (tracked at
// microsoft/TypeScript-DOM-lib-generator#1199); declare just the surface we use.

interface URLPatternInit {
  pathname?: string;
}

interface URLPatternComponentResult {
  input: string;
  groups: Record<string, string | undefined>;
}

interface URLPatternResult {
  pathname: URLPatternComponentResult;
}

interface URLPattern {
  exec(input: URLPatternInit | string): URLPatternResult | null;
}

interface URLPatternConstructor {
  new (init: URLPatternInit | string): URLPattern;
}

declare const URLPattern: URLPatternConstructor;
