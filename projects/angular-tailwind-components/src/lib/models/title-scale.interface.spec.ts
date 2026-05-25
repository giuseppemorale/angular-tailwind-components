import { DEFAULT_TAILWIND_TITLE_SCALE, resolveTailwindTitleScale } from './title-scale.interface';

describe('resolveTailwindTitleScale', () => {
  it('returns defaults when partial is omitted', () => {
    expect(resolveTailwindTitleScale()).toEqual(DEFAULT_TAILWIND_TITLE_SCALE);
  });

  it('merges partial tag overrides onto defaults', () => {
    const scale = resolveTailwindTitleScale({
      h1: { classes: 'text-5xl font-extrabold' },
      h3: { iconSize: 28 }
    });

    expect(scale.h1.classes).toBe('text-5xl font-extrabold');
    expect(scale.h1.iconSize).toBe(DEFAULT_TAILWIND_TITLE_SCALE.h1.iconSize);
    expect(scale.h3.classes).toBe(DEFAULT_TAILWIND_TITLE_SCALE.h3.classes);
    expect(scale.h3.iconSize).toBe(28);
    expect(scale.h2).toEqual(DEFAULT_TAILWIND_TITLE_SCALE.h2);
  });
});
