# leitner

A small TypeScript routing library for client-side single-page applications.

```ts
import { createRouter } from 'leitner';

const router = createRouter([
  { path: '/', name: 'home' },
  { path: '/cards', name: 'cards' },
]);

router.get(); // => { name: 'home', params: {}, path: '/' }
router.subscribe(route => console.log(route));
router.navigate('/cards');
```

See `CONTEXT.md` for the bounded vocabulary and `docs/adr/` for design decisions.
