export interface Pattern {
  readonly literal: string;
}

export function compile(path: string): Pattern {
  return { literal: canonicalize(path) };
}

export function match(pattern: Pattern, path: string): Record<string, string> | null {
  if (pattern.literal === canonicalize(path)) return {};
  return null;
}

function canonicalize(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
