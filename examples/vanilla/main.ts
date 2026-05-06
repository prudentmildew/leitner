import { createRouter, type Route } from 'leitner';

// Define your application's routes as a flat list of RouteDefinitions.
// Each entry maps a URL pattern to a logical name.
const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/cards', name: 'cards' },
  { path: '/cards/:id', name: 'card' },
]);

// Read the initial Route synchronously. Returns null if no RouteDefinition
// matches the current URL.
const initial = router.get();
render(initial);

// Subscribe to route changes. The listener fires whenever the Route changes
// (via navigate() or browser back/forward). It does NOT fire on subscription.
const unsubscribe = router.subscribe((route) => {
  render(route);
});

// Render the current Route into the DOM, including a 404 fallback for null.
function render(route: Route | null): void {
  const app = document.getElementById('app')!;

  if (route === null) {
    // No RouteDefinition matched — show a 404 fallback.
    app.innerHTML = '<h1>404 — Page not found</h1>';
    return;
  }

  switch (route.name) {
    case 'home':
      app.innerHTML = '<h1>Home</h1>';
      break;
    case 'cards':
      app.innerHTML = '<h1>All Cards</h1>';
      break;
    case 'card':
      // Access captured :param values from route.params.
      app.innerHTML = `<h1>Card ${route.params.id}</h1>`;
      break;
  }
}

// Wire up programmatic navigation from click handlers.
// navigate() pushes a history entry and updates the Route.
document.getElementById('nav-home')!.addEventListener('click', () => {
  router.navigate('/');
});

document.getElementById('nav-cards')!.addEventListener('click', () => {
  router.navigate('/cards');
});

document.getElementById('nav-card-42')!.addEventListener('click', () => {
  router.navigate('/cards/42');
});

// Navigate to an unmatched path to demonstrate the null/404 case.
document.getElementById('nav-missing')!.addEventListener('click', () => {
  router.navigate('/nowhere');
});

// Tear down the Router when your app unmounts. This removes the popstate
// listener and stops notifying subscribers.
window.addEventListener('beforeunload', () => {
  unsubscribe();
  router.destroy();
});
