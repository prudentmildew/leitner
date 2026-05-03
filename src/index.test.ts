import { afterEach, describe, expect, it } from 'vitest';
import { createRouter, type Router } from './index.js';

let routers: Router[] = [];

afterEach(() => {
  for (const r of routers) r.destroy();
  routers = [];
  history.replaceState(null, '', '/');
});

function make(routes: Parameters<typeof createRouter>[0]): Router {
  const r = createRouter(routes);
  routers.push(r);
  return r;
}

describe('createRouter (tracer)', () => {
  it('constructs with an empty RouteDefinition list and reports null', () => {
    const router = make([]);
    expect(router.get()).toBeNull();
  });
});
