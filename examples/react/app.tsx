import React from 'react';
import { useRouter, navigate, destroyRouter } from './use-router';
import type { Route } from 'leitner';

// A simple navigation bar wiring click handlers to navigate().
function Nav(): React.ReactElement {
  return (
    <nav>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/cards')}>Cards</button>
      <button onClick={() => navigate('/cards/42')}>Card 42</button>
      <button onClick={() => navigate('/nowhere')}>404 Demo</button>
    </nav>
  );
}

// Render a view based on the current Route. When Route is null (no
// RouteDefinition matched), show a 404 fallback.
function View({ route }: { route: Route | null }): React.ReactElement {
  if (route === null) {
    // No RouteDefinition matched the current URL — render a fallback.
    return <h1>404 — Page not found</h1>;
  }

  switch (route.name) {
    case 'home':
      return <h1>Home</h1>;
    case 'cards':
      return <h1>All Cards</h1>;
    case 'card':
      // Access captured :param values from route.params.
      return <h1>Card {route.params.id}</h1>;
    default:
      return <h1>404 — Page not found</h1>;
  }
}

// The root App component. useRouter() re-renders this component whenever the
// Route changes — no manual subscription management needed.
export default function App(): React.ReactElement {
  const route = useRouter();

  // Tear down the Router when the entire app unmounts. In most SPAs this
  // never fires, but it demonstrates proper cleanup.
  React.useEffect(() => {
    return () => destroyRouter();
  }, []);

  return (
    <div>
      <Nav />
      <View route={route} />
    </div>
  );
}
