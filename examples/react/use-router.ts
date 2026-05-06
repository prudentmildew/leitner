import { useSyncExternalStore } from 'react';
import { createRouter, type Route, type RouteDefinition, type Router } from 'leitner';

// Create the Router once at module scope. RouteDefinitions are static — they
// never change after construction.
const router: Router = createRouter([
  { path: '/', name: 'home' },
  { path: '/cards', name: 'cards' },
  { path: '/cards/:id', name: 'card' },
]);

// Wrap Router's get/subscribe with useSyncExternalStore. The Router interface
// is already shaped to satisfy React's external store contract:
//   - subscribe(listener): () => void
//   - get(): snapshot
export function useRouter(): Route | null {
  return useSyncExternalStore(
    // subscribe — React calls this with its own listener; we return the
    // unsubscribe function.
    (listener) => router.subscribe(listener),
    // getSnapshot — React calls this to read the current value.
    () => router.get(),
  );
}

// Expose navigate for components that need programmatic navigation.
export function navigate(path: string, options?: { replace?: boolean }): void {
  router.navigate(path, options);
}

// Expose destroy for cleanup when the application unmounts entirely.
export function destroyRouter(): void {
  router.destroy();
}
