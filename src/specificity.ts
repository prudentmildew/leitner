import type { RouteDefinition } from './index.js';

export function sortBySpecificity<T extends RouteDefinition>(routes: readonly T[]): T[] {
  const indexed = routes.map((route, index) => ({ route, index }));
  indexed.sort((a, b) => {
    const cmp = compareSpecificity(a.route.path, b.route.path);
    if (cmp !== 0) return cmp;
    return a.index - b.index;
  });
  return indexed.map(({ route }) => route);
}

function compareSpecificity(a: string, b: string): number {
  const aSegs = segmentsOf(a);
  const bSegs = segmentsOf(b);
  const len = Math.min(aSegs.length, bSegs.length);
  for (let i = 0; i < len; i++) {
    const aIsParam = aSegs[i].startsWith(':');
    const bIsParam = bSegs[i].startsWith(':');
    if (aIsParam && !bIsParam) return 1;
    if (!aIsParam && bIsParam) return -1;
  }
  return 0;
}

function segmentsOf(path: string): string[] {
  return path.split('/').filter((s) => s.length > 0);
}
