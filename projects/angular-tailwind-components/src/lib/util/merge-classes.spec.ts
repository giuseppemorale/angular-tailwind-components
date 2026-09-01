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

  it('should keep classes that do not conflict', () => {
    expect(mergeClasses('bg-surface rounded-surface border', 'h-full mb-4')).toBe(
      'bg-surface rounded-surface border h-full mb-4'
    );
  });

  /*
   * The regression these cover: plain concatenation left both classes on the element, so the winner
   * was whichever Tailwind emitted last — alphabetical by value, which made `bg-red-500` lose to
   * `bg-surface` while `bg-teal-500` won.
   */
  it.each([
    ['bg-surface', 'bg-red-500'],
    ['bg-surface', 'bg-teal-500'],
    ['bg-surface-subtle', 'bg-red-500'],
    ['text-fg', 'text-red-700'],
    ['border-border', 'border-red-500'],
    ['p-6', 'p-2'],
    ['text-sm', 'text-lg'],
    ['shadow-sm', 'shadow-none']
  ])('should let the consumer override %s with %s', (base, consumer) => {
    expect(mergeClasses(base, consumer)).toBe(consumer);
  });

  it.each([
    ['rounded-surface', 'rounded-full'],
    ['rounded-control', 'rounded-none'],
    ['rounded-control-inner', 'rounded-md'],
    ['rounded-t-control', 'rounded-t-none'],
    ['animate-overlay-in', 'animate-none'],
    ['z-popover', 'z-50']
  ])('should resolve the role token %s against %s', (base, consumer) => {
    expect(mergeClasses(base, consumer)).toBe(consumer);
  });

  it.each(['field-depth', 'surface-highlight'])('should let shadow-none clear %s', base => {
    expect(mergeClasses(base, 'shadow-none')).toBe('shadow-none');
  });

  /*
   * Tailwind v4 resolves `text-<size>` to `line-height: var(--tw-leading, …)` and `leading-*` sets
   * `--tw-leading`, so a size utility never overrides a leading one — unlike tailwind-merge's
   * default, which silently changed the line-height of badge, chip and tag.
   */
  it('should keep leading next to a font size, in either order', () => {
    expect(mergeClasses('leading-none', 'text-xs')).toBe('leading-none text-xs');
    expect(mergeClasses('text-xs', 'leading-none')).toBe('text-xs leading-none');
  });

  it('should not touch variants of a different state', () => {
    expect(mergeClasses('bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300')).toBe(
      'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300'
    );
  });
});
