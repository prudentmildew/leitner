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

  it('captures a single :param', () => {
    const pattern = compile('/cards/:id');
    expect(match(pattern, '/cards/42')).toEqual({ id: '42' });
  });

  it('captures multiple :param segments', () => {
    const pattern = compile('/decks/:deckId/cards/:cardId');
    expect(match(pattern, '/decks/abc/cards/42')).toEqual({ deckId: 'abc', cardId: '42' });
  });

  it('decodes percent-encoded ASCII in captured params', () => {
    const pattern = compile('/cards/:id');
    expect(match(pattern, '/cards/Hello%20World')).toEqual({ id: 'Hello World' });
  });

  it('decodes percent-encoded UTF-8 in captured params', () => {
    const pattern = compile('/cards/:id');
    expect(match(pattern, '/cards/%E2%98%83')).toEqual({ id: '☃' });
  });

  it('returns null when a captured param has malformed percent-encoding', () => {
    const pattern = compile('/cards/:id');
    expect(match(pattern, '/cards/%E0%A4%A')).toBeNull();
    expect(match(pattern, '/cards/%')).toBeNull();
  });

  it.each([
    ['/cards/:id?', '?'],
    ['/files/*', '*'],
    ['/files/:rest+', '+'],
    ['/cards/(.*)', '('],
    ['/cards/{id}', '{'],
  ])('compile throws on extended URLPattern syntax: %s', (path) => {
    expect(() => compile(path)).toThrow(RangeError);
  });
});
