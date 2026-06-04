import { mergeClasses } from './merge-classes';

describe('mergeClasses', () => {
  it('should join non-empty parts', () => {
    expect(mergeClasses('a', 'b')).toBe('a b');
  });

  it('should skip null, undefined and blank strings', () => {
    expect(mergeClasses('a', null, undefined, '', '  ', 'b')).toBe('a b');
  });

  it('should return empty string when all parts are empty', () => {
    expect(mergeClasses()).toBe('');
    expect(mergeClasses(null, '')).toBe('');
  });
});
