import { describe, expect, it } from 'vitest';
import { validate } from './validator.js';

describe('validate', () => {
  it('accepts a valid RouteDefinition list', () => {
    expect(() =>
      validate([
        { path: '/', name: 'home' },
        { path: '/cards', name: 'cards' },
      ]),
    ).not.toThrow();
  });

  it('accepts an empty RouteDefinition list', () => {
    expect(() => validate([])).not.toThrow();
  });

  it('throws when a path is missing the leading slash', () => {
    expect(() => validate([{ path: 'cards', name: 'cards' }])).toThrow(/leading slash|start with/i);
  });

  it('throws when two RouteDefinitions share a name', () => {
    expect(() =>
      validate([
        { path: '/a', name: 'dup' },
        { path: '/b', name: 'dup' },
      ]),
    ).toThrow(/duplicate.*name|name.*duplicate/i);
  });

  it('throws when two RouteDefinitions share a path', () => {
    expect(() =>
      validate([
        { path: '/cards', name: 'a' },
        { path: '/cards', name: 'b' },
      ]),
    ).toThrow(/duplicate.*path|path.*duplicate/i);
  });

  it('treats /cards and /cards/ as the same path for duplicate-path detection', () => {
    expect(() =>
      validate([
        { path: '/cards', name: 'a' },
        { path: '/cards/', name: 'b' },
      ]),
    ).toThrow(/duplicate.*path|path.*duplicate/i);
  });

  it.each(['/cards/:', '/cards/:/foo'])('throws on anonymous : in %s', (path) => {
    expect(() => validate([{ path, name: 'x' }])).toThrow(/anonymous|empty.*param|: must be followed/i);
  });

  it.each([
    '/cards/:id?',
    '/files/*',
    '/files/:rest+',
    '/cards/(.*)',
    '/cards/{id}',
  ])('throws on extended URLPattern syntax in %s', (path) => {
    expect(() => validate([{ path, name: 'x' }])).toThrow(
      /literal|:param|not allowed|invalid/i,
    );
  });
});
