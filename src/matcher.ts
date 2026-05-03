const EXTENDED_SYNTAX = /[?*+({]/;

export function compile(path: string): URLPattern {
  const offending = path.match(EXTENDED_SYNTAX);
  if (offending !== null) {
    throw new RangeError(
      `Invalid RouteDefinition path "${path}": "${offending[0]}" is not allowed; only literal segments and :param are supported.`,
    );
  }
  const pathname = canonicalize(path);
  try {
    return new URLPattern({ pathname });
  } catch (cause) {
    throw new Error(
      `Invalid RouteDefinition path "${path}": ${(cause as Error).message}`,
    );
  }
}

export function match(pattern: URLPattern, path: string): Record<string, string> | null {
  const result = pattern.exec({ pathname: canonicalize(path) });
  if (result === null) return null;
  const groups = result.pathname.groups;
  const params: Record<string, string> = {};
  for (const key of Object.keys(groups)) {
    const value = groups[key];
    if (value === undefined) continue;
    try {
      params[key] = decodeURIComponent(value);
    } catch {
      return null;
    }
  }
  return params;
}

function canonicalize(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
}
