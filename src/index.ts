import { compile, match } from './matcher.js';
import { validate } from './validator.js';

export interface RouteDefinition {
  readonly path: string;
  readonly name: string;
}

export interface Route {
  readonly name: string;
  readonly params: Record<string, string>;
  readonly path: string;
}

type RouteListener = (route: Route | null) => void;

export interface Router {
  get(): Route | null;
  subscribe(listener: RouteListener): () => void;
  navigate(path: string, options?: { replace?: boolean }): void;
  destroy(): void;
}

interface CompiledRoute {
  readonly definition: RouteDefinition;
  readonly pattern: URLPattern;
}

export function createRouter(routes: readonly RouteDefinition[]): Router {
  validate(routes);

  const compiled: CompiledRoute[] = routes.map((definition) => ({
    definition,
    pattern: compile(definition.path),
  }));

  const listeners = new Set<RouteListener>();
  let current: Route | null = resolve(window.location.pathname);

  function resolve(path: string): Route | null {
    for (const { definition, pattern } of compiled) {
      const params = match(pattern, path);
      if (params !== null) {
        return { name: definition.name, params, path: canonicalize(path) };
      }
    }
    return null;
  }

  function update(): void {
    const next = resolve(window.location.pathname);
    if (sameRoute(current, next)) return;
    current = next;
    for (const listener of listeners) listener(current);
  }

  const onPopState = (): void => update();
  window.addEventListener('popstate', onPopState);

  return {
    get: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    navigate: (path, options) => {
      if (options?.replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
      update();
    },
    destroy: () => {
      window.removeEventListener('popstate', onPopState);
      listeners.clear();
    },
  };
}

function canonicalize(path: string): string {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

function sameRoute(a: Route | null, b: Route | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.name !== b.name) return false;
  const aKeys = Object.keys(a.params);
  const bKeys = Object.keys(b.params);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (a.params[key] !== b.params[key]) return false;
  }
  return true;
}
