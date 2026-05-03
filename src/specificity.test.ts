import { describe, expect, it } from 'vitest';
import { sortBySpecificity } from './specificity.js';

describe('sortBySpecificity', () => {
  it('ranks a literal segment before a :param segment regardless of declaration order', () => {
    const declaredParamFirst = sortBySpecificity([
      { path: '/cards/:id', name: 'card' },
      { path: '/cards/new', name: 'cardNew' },
    ]);
    expect(declaredParamFirst.map((r) => r.name)).toEqual(['cardNew', 'card']);

    const declaredLiteralFirst = sortBySpecificity([
      { path: '/cards/new', name: 'cardNew' },
      { path: '/cards/:id', name: 'card' },
    ]);
    expect(declaredLiteralFirst.map((r) => r.name)).toEqual(['cardNew', 'card']);
  });

  it('preserves declaration order between two equally-specific patterns', () => {
    const result = sortBySpecificity([
      { path: '/cards/:id', name: 'card' },
      { path: '/users/:id', name: 'user' },
    ]);
    expect(result.map((r) => r.name)).toEqual(['card', 'user']);

    const reversed = sortBySpecificity([
      { path: '/users/:id', name: 'user' },
      { path: '/cards/:id', name: 'card' },
    ]);
    expect(reversed.map((r) => r.name)).toEqual(['user', 'card']);
  });

  it('disambiguates deeper static-vs-param patterns at the first differing position', () => {
    const result = sortBySpecificity([
      { path: '/a/:x/:y', name: 'paramParam' },
      { path: '/a/b/:y', name: 'literalParam' },
      { path: '/a/:x/c', name: 'paramLiteral' },
      { path: '/a/b/c', name: 'literalLiteral' },
    ]);
    expect(result.map((r) => r.name)).toEqual([
      'literalLiteral',
      'literalParam',
      'paramLiteral',
      'paramParam',
    ]);
  });

  it('returns a new array without mutating the input', () => {
    const input = [
      { path: '/cards/:id', name: 'card' },
      { path: '/cards/new', name: 'cardNew' },
    ];
    const snapshot = input.map((r) => r.name);
    const result = sortBySpecificity(input);

    expect(result).not.toBe(input);
    expect(input.map((r) => r.name)).toEqual(snapshot);
  });
});
