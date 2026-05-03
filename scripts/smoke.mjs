import assert from 'node:assert/strict';

const stubWindow = {
  location: { pathname: '/' },
  history: {
    pushState: () => {},
    replaceState: () => {},
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.window = stubWindow;

const { createRouter } = await import('../dist/index.js');

assert.equal(typeof createRouter, 'function', 'createRouter is a function');

const router = createRouter([{ path: '/', name: 'home' }]);

for (const method of ['get', 'subscribe', 'navigate', 'destroy']) {
  assert.equal(typeof router[method], 'function', `router.${method} is a function`);
}

const route = router.get();
assert.equal(route?.name, 'home', 'router.get() returns the matched route');

router.destroy();

console.log('smoke ok');
