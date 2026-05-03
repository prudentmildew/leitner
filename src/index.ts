export interface RouteDefinition {
  readonly path: string;
  readonly name: string;
}

export interface Route {
  readonly name: string;
  readonly params: Record<string, string>;
  readonly path: string;
}

export interface Router {
  get(): Route | null;
  subscribe(fn: (route: Route | null) => void): () => void;
  navigate(path: string, options?: { replace?: boolean }): void;
  destroy(): void;
}

export function createRouter(_routes: RouteDefinition[]): Router {
  return {
    get: () => null,
    subscribe: () => () => {},
    navigate: () => {},
    destroy: () => {},
  };
}
