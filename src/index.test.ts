import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, type Route, type Router } from './index.js';

let routers: Router[] = [];

beforeEach(() => {
  history.replaceState(null, '', '/');
});

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

describe('createRouter', () => {
  it('constructs with an empty RouteDefinition list and reports null', () => {
    const router = make([]);
    expect(router.get()).toBeNull();
  });

  it('matches the initial window.location.pathname against RouteDefinitions', () => {
    history.replaceState(null, '', '/');
    const router = make([{ path: '/', name: 'home' }]);
    expect(router.get()).toEqual<Route>({ name: 'home', params: {}, path: '/' });
  });

  it('returns null when no RouteDefinition matches the initial location', () => {
    history.replaceState(null, '', '/missing');
    const router = make([{ path: '/', name: 'home' }]);
    expect(router.get()).toBeNull();
  });

  it('navigate(path) updates Route, fires subscribers, and pushes history', () => {
    const router = make([
      { path: '/', name: 'home' },
      { path: '/cards', name: 'cards' },
    ]);
    const fn = vi.fn();
    router.subscribe(fn);

    const before = history.length;
    router.navigate('/cards');

    expect(router.get()).toEqual<Route>({ name: 'cards', params: {}, path: '/cards' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'cards', params: {}, path: '/cards' });
    expect(location.pathname).toBe('/cards');
    expect(history.length).toBe(before + 1);
  });

  it('navigate to an unmatched path sets Route to null and notifies subscribers', () => {
    const router = make([{ path: '/', name: 'home' }]);
    const fn = vi.fn();
    router.subscribe(fn);

    router.navigate('/missing');

    expect(router.get()).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(null);
  });

  it('responds to popstate by recomputing the Route and notifying subscribers', () => {
    const router = make([
      { path: '/', name: 'home' },
      { path: '/cards', name: 'cards' },
    ]);
    router.navigate('/cards');
    const fn = vi.fn();
    router.subscribe(fn);

    history.replaceState(null, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(router.get()).toEqual<Route>({ name: 'home', params: {}, path: '/' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ name: 'home', params: {}, path: '/' });
  });

  it('subscribe does NOT fire the listener on subscription', () => {
    const router = make([{ path: '/', name: 'home' }]);
    const fn = vi.fn();
    router.subscribe(fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it('subscribe returns an unsubscribe function that detaches the listener', () => {
    const router = make([
      { path: '/', name: 'home' },
      { path: '/cards', name: 'cards' },
    ]);
    const fn = vi.fn();
    const unsubscribe = router.subscribe(fn);
    unsubscribe();

    router.navigate('/cards');

    expect(router.get()?.name).toBe('cards');
    expect(fn).not.toHaveBeenCalled();
  });

  it('destroy() detaches the popstate listener and stops further notifications', () => {
    const router = make([
      { path: '/', name: 'home' },
      { path: '/cards', name: 'cards' },
    ]);
    const fn = vi.fn();
    router.subscribe(fn);

    router.destroy();

    history.replaceState(null, '', '/cards');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(fn).not.toHaveBeenCalled();
  });

  it('treats /cards and /cards/ as the same Route (trailing slash normalized)', () => {
    const router = make([{ path: '/cards', name: 'cards' }]);
    router.navigate('/cards/');
    expect(router.get()).toEqual<Route>({ name: 'cards', params: {}, path: '/cards' });
  });

  it('matches case-sensitively at the Router level', () => {
    const router = make([{ path: '/cards', name: 'cards' }]);
    router.navigate('/Cards');
    expect(router.get()).toBeNull();
  });
});
