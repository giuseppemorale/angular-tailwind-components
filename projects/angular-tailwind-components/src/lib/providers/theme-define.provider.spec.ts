import { ApplicationInitStatus } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTailwindConfig } from './theme-define.provider';
import {
  DEFAULT_TAILWIND_ICON_BASE_PATH,
  TAILWIND_BUTTON_KIND,
  TAILWIND_ICON_BASE_PATH,
  TAILWIND_LABELS
} from '../tokens';
import { DEFAULT_TAILWIND_LABELS } from '../models';
import {
  TAILWIND_RADIUS_HTML_ATTR,
  TAILWIND_RADIUS_STYLE_ID,
  TAILWIND_THEME_HTML_ATTR,
  TAILWIND_THEME_STYLE_ID
} from './properties/constant';

describe('provideTailwindConfig', () => {
  it('registers token values from a plain config object', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ BUTTON_KIND: 'outlined' })]
    });

    expect(TestBed.inject(TAILWIND_BUTTON_KIND)).toBe('outlined');
  });

  it('still accepts a factory for configs that need inject()', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig(() => ({ BUTTON_KIND: 'ghost' }))]
    });

    expect(TestBed.inject(TAILWIND_BUTTON_KIND)).toBe('ghost');
  });

  // The factory used to run once per token provider, so a config built from a translation service
  // paid for the whole object ten times over. It is now cached, and the only extra call is the
  // startup read of RADIUS / COLORS, which deliberately does not share that cache.
  it('resolves a config factory once for every token', () => {
    let calls = 0;
    TestBed.configureTestingModule({
      providers: [
        provideTailwindConfig(() => {
          calls++;
          return { BUTTON_KIND: 'flat' as const, COMPONENTS_SIZE: 'lg' as const };
        })
      ]
    });

    TestBed.inject(TAILWIND_BUTTON_KIND);
    TestBed.inject(TAILWIND_LABELS);
    TestBed.inject(TAILWIND_ICON_BASE_PATH);

    expect(calls).toBeLessThanOrEqual(2);
  });

  // The config providers shadow the tokens' own `providedIn: 'root'` factories, so a config that
  // omits a key must still hand consumers the default instead of `undefined`.
  it('keeps the built-in labels when the config omits LABELS', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ BUTTON_KIND: 'flat' })]
    });

    expect(TestBed.inject(TAILWIND_LABELS)).toEqual(DEFAULT_TAILWIND_LABELS);
  });

  it('merges partial LABELS onto the built-in ones', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ LABELS: { close: 'Chiudi' } })]
    });

    const labels = TestBed.inject(TAILWIND_LABELS);
    expect(labels.close).toBe('Chiudi');
    expect(labels.openNavigationMenu).toBe(DEFAULT_TAILWIND_LABELS.openNavigationMenu);
  });

  it('keeps the default icon base path when the config omits ICON_BASE_PATH', () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ BUTTON_KIND: 'flat' })]
    });

    expect(TestBed.inject(TAILWIND_ICON_BASE_PATH)).toBe(DEFAULT_TAILWIND_ICON_BASE_PATH);
  });
});

describe('provideTailwindConfig theme keys', () => {
  afterEach(() => {
    document.getElementById(TAILWIND_RADIUS_STYLE_ID)?.remove();
    document.getElementById(TAILWIND_THEME_STYLE_ID)?.remove();
    document.documentElement.removeAttribute(TAILWIND_RADIUS_HTML_ATTR);
    document.documentElement.removeAttribute(TAILWIND_THEME_HTML_ATTR);
  });

  it('applies RADIUS at startup', async () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ RADIUS: 'round' })]
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(document.getElementById(TAILWIND_RADIUS_STYLE_ID)?.textContent).toContain('--radius-control: 0.75rem;');
  });

  it('applies COLORS at startup', async () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ COLORS: { primary: { 600: '#3a7d44' } } })]
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(document.getElementById(TAILWIND_THEME_STYLE_ID)?.textContent).toContain('--color-primary-600: #3a7d44;');
  });

  it('applies both alongside the token overrides', async () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ BUTTON_KIND: 'soft', RADIUS: 'sharp', COLORS: { primary: 'indigo' } })]
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(TestBed.inject(TAILWIND_BUTTON_KIND)).toBe('soft');
    expect(document.getElementById(TAILWIND_RADIUS_STYLE_ID)?.textContent).toContain('--radius-control: 0px;');
    expect(document.getElementById(TAILWIND_THEME_STYLE_ID)?.textContent).toContain(
      '--color-primary-600: var(--color-indigo-600);'
    );
  });

  it('writes nothing when the config carries neither key', async () => {
    TestBed.configureTestingModule({
      providers: [provideTailwindConfig({ BUTTON_KIND: 'flat' })]
    });
    await TestBed.inject(ApplicationInitStatus).donePromise;

    expect(document.getElementById(TAILWIND_RADIUS_STYLE_ID)).toBeNull();
    expect(document.getElementById(TAILWIND_THEME_STYLE_ID)).toBeNull();
  });
});
