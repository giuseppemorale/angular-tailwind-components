import {
  applyTailwindThemeColors,
  buildTailwindNeutralDarkEntries,
  buildTailwindThemeCss,
  buildTailwindThemeVariableEntries
} from './theme-colors';
import { TAILWIND_THEME_STYLE_ID } from '../properties/constant';

describe('buildTailwindThemeVariableEntries', () => {
  it('maps string palette to var references for each shade', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: { primary: 'indigo' }
    });
    expect(entries).toContainEqual(['--color-primary-600', 'var(--color-indigo-600)']);
    expect(entries.find(([k]) => k === '--color-on-primary-600')).toBeUndefined();
  });

  it('writes flat shade object as CSS colors (legacy)', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: { success: { 600: '#abc', 700: '#def' } }
    });
    expect(entries).toContainEqual(['--color-success-600', '#abc']);
    expect(entries).toContainEqual(['--color-success-700', '#def']);
  });

  it('writes on-* variables from structured palette', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: {
        danger: {
          shades: { 600: '#900', 700: '#800' },
          on: { 600: '#fff', 700: '#f0f0f0' }
        }
      }
    });
    expect(entries).toContainEqual(['--color-danger-600', '#900']);
    expect(entries).toContainEqual(['--color-on-danger-600', '#fff']);
    expect(entries).toContainEqual(['--color-on-danger-700', '#f0f0f0']);
  });

  it('fills default on-* tokens for custom shade objects when on is omitted', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: {
        primary: {
          shades: { 600: '#3a7d44', 100: '#e3efe5' },
          on: { 600: '#ffffff' }
        }
      }
    });
    expect(entries).toContainEqual(['--color-primary-600', '#3a7d44']);
    expect(entries).toContainEqual(['--color-on-primary-600', '#ffffff']);
    expect(entries).toContainEqual(['--color-on-primary-100', 'var(--color-neutral-900)']);
  });

  it('emits full custom primary palette from structured object form', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: {
        primary: {
          shades: {
            50: '#f3f8f4',
            600: '#3a7d44',
            950: '#0f2114'
          },
          on: { 600: '#ffffff' }
        }
      }
    });
    expect(entries).toContainEqual(['--color-primary-50', '#f3f8f4']);
    expect(entries).toContainEqual(['--color-primary-600', '#3a7d44']);
    expect(entries).toContainEqual(['--color-on-primary-600', '#ffffff']);
    expect(entries).toContainEqual(['--color-on-primary-50', 'var(--color-neutral-900)']);
    expect(entries).toContainEqual(['--color-on-primary-950', '#ffffff']);
  });

  it('maps error alias to danger semantic keys', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: { error: { 500: '#e00' } }
    });
    expect(entries).toContainEqual(['--color-danger-500', '#e00']);
  });

  it('does not emit button kind (handled by TAILWIND_BUTTON_KIND provider, not CSS vars)', () => {
    const entries = buildTailwindThemeVariableEntries({ BUTTON_KIND: 'flat' });
    expect(entries).toEqual([]);
  });

  it('ignores invalid shade keys on flat objects', () => {
    const entries = buildTailwindThemeVariableEntries({
      COLORS: { info: { 600: '#00f', foo: 'x' } as Record<string, string> }
    });
    expect(entries).toContainEqual(['--color-info-600', '#00f']);
    expect(entries.some(([k]) => k.includes('foo'))).toBe(false);
  });
});

describe('buildTailwindThemeCss', () => {
  it('returns empty string when no colors are configured', () => {
    expect(buildTailwindThemeCss({})).toBe('');
  });

  it('wraps palette string entries in @layer theme', () => {
    const css = buildTailwindThemeCss({ primary: 'indigo' });
    expect(css).toMatch(/^@layer theme \{/);
    expect(css).toContain(':root[data-tailwind-theme],');
    expect(css).toContain('--color-primary-600: var(--color-indigo-600);');
    expect(css).toMatch(/\}\s*\}$/);
  });

  it('wraps hex shade entries in @layer theme', () => {
    const css = buildTailwindThemeCss({ success: { 600: '#abc', 700: '#def' } });
    expect(css).toContain('@layer theme');
    expect(css).toContain('--color-success-600: #abc;');
    expect(css).toContain('--color-success-700: #def;');
    expect(css).toContain('--color-on-success-600: #ffffff;');
  });

  it('emits no dark block when neutral is not customised', () => {
    const css = buildTailwindThemeCss({ primary: 'indigo' });
    expect(css).not.toContain('.dark');
    expect(css).not.toContain('prefers-color-scheme');
  });

  // The light ramp sits on `:root[data-tailwind-theme]` and would beat the slate mirror of `tailwind.css`:
  // dark mode needs its own mirror of the custom palette, one selector step more specific.
  it('mirrors a custom neutral palette for dark mode', () => {
    const css = buildTailwindThemeCss({ neutral: 'zinc' });
    expect(css).toContain(":root[data-tailwind-theme].dark,\n  :root[data-tailwind-theme][data-theme='dark'] {");
    expect(css).toContain('    --color-neutral-50: var(--color-zinc-950);');
    expect(css).toContain('    --color-neutral-100: var(--color-zinc-900);');
    expect(css).toContain('    --color-neutral-500: var(--color-zinc-400);');
    expect(css).toContain('    --color-neutral-950: var(--color-zinc-50);');
  });

  it('follows the OS setting with the same mirror under theme-auto', () => {
    const css = buildTailwindThemeCss({ neutral: 'zinc' });
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(":root[data-tailwind-theme].theme-auto:not(.light):not([data-theme='light'])");
    expect(css).toContain('      --color-neutral-50: var(--color-zinc-950);');
  });
});

describe('buildTailwindNeutralDarkEntries', () => {
  it('returns nothing without a neutral palette', () => {
    expect(buildTailwindNeutralDarkEntries(undefined)).toEqual([]);
    expect(buildTailwindNeutralDarkEntries('  ')).toEqual([]);
  });

  it('mirrors the shades of a custom object, skipping the missing ones', () => {
    const entries = buildTailwindNeutralDarkEntries({ 50: '#fafafa', 900: '#18181b', 950: '#09090b' });
    expect(entries).toContainEqual(['--color-neutral-50', '#09090b']);
    expect(entries).toContainEqual(['--color-neutral-100', '#18181b']);
    expect(entries).toContainEqual(['--color-neutral-950', '#fafafa']);
    expect(entries.find(([k]) => k === '--color-neutral-200')).toBeUndefined();
  });
});

describe('applyTailwindThemeColors', () => {
  let document: Document;

  beforeEach(() => {
    document = window.document.implementation.createHTMLDocument('test');
    const head = document.createElement('head');
    document.documentElement.insertBefore(head, document.body);
  });

  it('appends a style element to head with theme variables and marks html', () => {
    applyTailwindThemeColors(document, { primary: { 600: '#3a7d44' } });

    const style = document.getElementById(TAILWIND_THEME_STYLE_ID);
    expect(style?.parentElement).toBe(document.head);
    expect(style?.textContent).toContain('@layer theme');
    expect(style?.textContent).toContain('--color-primary-600: #3a7d44;');
    expect(document.documentElement.getAttribute('data-tailwind-theme')).toBe('');
    expect(document.documentElement.getAttribute('style')).toBeNull();
  });

  it('updates existing style on second apply without duplicating the element', () => {
    applyTailwindThemeColors(document, { primary: { 600: '#111' } });
    applyTailwindThemeColors(document, { primary: { 600: '#222' } });

    const styles = document.head.querySelectorAll(`#${TAILWIND_THEME_STYLE_ID}`);
    expect(styles.length).toBe(1);
    expect(styles[0]?.textContent).toContain('--color-primary-600: #222;');
    expect(document.documentElement.getAttribute('style')).toBeNull();
  });

  it('removes style element and html marker when colors resolve to empty css', () => {
    applyTailwindThemeColors(document, { primary: { 600: '#111' } });
    applyTailwindThemeColors(document, {});

    expect(document.getElementById(TAILWIND_THEME_STYLE_ID)).toBeNull();
    expect(document.documentElement.hasAttribute('data-tailwind-theme')).toBe(false);
  });
});
