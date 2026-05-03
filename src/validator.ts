import type { RouteDefinition } from './index.js';

const EXTENDED_SYNTAX = /[?*+({]/;
const ANONYMOUS_PARAM = /(?:^|\/):(?=\/|$)/;

export function validate(routes: readonly RouteDefinition[]): void {
  const seenNames = new Set<string>();
  const seenPaths = new Set<string>();
  for (const route of routes) {
    if (!route.path.startsWith('/')) {
      throw new Error(
        `Invalid RouteDefinition path "${route.path}": path must start with a leading slash.`,
      );
    }
    const offending = route.path.match(EXTENDED_SYNTAX);
    if (offending !== null) {
      throw new Error(
        `Invalid RouteDefinition path "${route.path}": "${offending[0]}" is not allowed; only literal segments and :param are supported.`,
      );
    }
    if (ANONYMOUS_PARAM.test(route.path)) {
      throw new Error(
        `Invalid RouteDefinition path "${route.path}": anonymous ":" is not allowed; ":" must be followed by a parameter name.`,
      );
    }
    if (seenNames.has(route.name)) {
      throw new Error(`Duplicate RouteDefinition name: "${route.name}".`);
    }
    seenNames.add(route.name);

    const canonical = canonicalize(route.path);
    if (seenPaths.has(canonical)) {
      throw new Error(`Duplicate RouteDefinition path: "${route.path}".`);
    }
    seenPaths.add(canonical);
  }
}

function canonicalize(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
