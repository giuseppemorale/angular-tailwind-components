import { TestBed } from '@angular/core/testing';
import {
  applyTailwindThemeColors,
  buildTailwindThemeCss,
  buildTailwindThemeVariableEntries,
  provideTailwindConfig,
  TAILWIND_THEME_STYLE_ID
} from './theme-define.provider';
import { TAILWIND_BUTTON_KIND } from '../tokens';

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
    expect(document.documentElement.style.getPropertyValue('--color-primary-600').trim()).toBe('#3a7d44');
  });

  it('updates existing style and html variables on second apply', () => {
    applyTailwindThemeColors(document, { primary: { 600: '#111' } });
    applyTailwindThemeColors(document, { primary: { 600: '#222' } });

    const styles = document.head.querySelectorAll(`#${TAILWIND_THEME_STYLE_ID}`);
    expect(styles.length).toBe(1);
    expect(styles[0]?.textContent).toContain('--color-primary-600: #222;');
    expect(document.documentElement.style.getPropertyValue('--color-primary-600').trim()).toBe('#222');
  });

  it('removes style element, html marker, and inline variables when colors resolve to empty css', () => {
    applyTailwindThemeColors(document, { primary: { 600: '#111' } });
    applyTailwindThemeColors(document, {});

    expect(document.getElementById(TAILWIND_THEME_STYLE_ID)).toBeNull();
    expect(document.documentElement.hasAttribute('data-tailwind-theme')).toBe(false);
    expect(document.documentElement.style.getPropertyValue('--color-primary-600').trim()).toBe('');
  });
});

describe('provideTailwindConfig', () => {
  it('registers token values from a factory (inject-safe context)', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig(() => ({ BUTTON_KIND: 'outlined' }))]
    });

    expect(TestBed.inject(TAILWIND_BUTTON_KIND)).toBe('outlined');
  });
});
