import { describe, expect, it } from 'vitest';
import { compile, match } from './matcher.js';

describe('matcher', () => {
  it('matches a literal path exactly and returns no params', () => {
    const pattern = compile('/cards');
    expect(match(pattern, '/cards')).toEqual({});
  });

  it('returns null when the literal does not match', () => {
    const pattern = compile('/cards');
    expect(match(pattern, '/decks')).toBeNull();
  });

  it('matches the root path', () => {
    const pattern = compile('/');
    expect(match(pattern, '/')).toEqual({});
    expect(match(pattern, '/cards')).toBeNull();
  });

  it('normalizes trailing slashes on the path being matched', () => {
    const pattern = compile('/cards');
    expect(match(pattern, '/cards/')).toEqual({});
  });

  it('normalizes trailing slashes on the pattern being compiled', () => {
    const pattern = compile('/cards/');
    expect(match(pattern, '/cards')).toEqual({});
  });

  it('does not strip the trailing slash from the root path', () => {
    const pattern = compile('/');
    expect(match(pattern, '')).toBeNull();
  });

  it('matches case-sensitively', () => {
    const pattern = compile('/cards');
    expect(match(pattern, '/Cards')).toBeNull();
    expect(match(pattern, '/CARDS')).toBeNull();
  });
});
