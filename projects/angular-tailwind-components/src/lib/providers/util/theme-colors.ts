import type { TailwindComponentsConfig, TailwindDefineThemeColors } from '../interfaces/theme-config.interface';
import type {
  TailwindThemeColorShade,
  TailwindThemeSemantic,
  TailwindThemeSemanticPaletteObject,
  TailwindThemeSemanticShades,
  TailwindThemeSeverityColor
} from '../types/theme-config.types';
import {
  SHADES_TO_900,
  SHADES_WITH_950,
  TAILWIND_THEME_HTML_ATTR,
  TAILWIND_THEME_STYLE_ID
} from '../properties/constant';

/** Angular production build sets global `ngDevMode` to `false`. */
declare const ngDevMode: boolean | undefined;

function shadesForSemantic(semantic: TailwindThemeSemantic): readonly number[] {
  switch (semantic) {
    case 'success':
    case 'warning':
    case 'danger':
    case 'info':
      return SHADES_TO_900;
    default:
      return SHADES_WITH_950;
  }
}

function isValidShadeKey(key: string): key is TailwindThemeColorShade {
  return (
    key === '50' ||
    key === '100' ||
    key === '200' ||
    key === '300' ||
    key === '400' ||
    key === '500' ||
    key === '600' ||
    key === '700' ||
    key === '800' ||
    key === '900' ||
    key === '950'
  );
}

function isSemanticPaletteObject(value: object): value is TailwindThemeSemanticPaletteObject {
  return (
    'shades' in value &&
    typeof (value as TailwindThemeSemanticPaletteObject).shades === 'object' &&
    (value as TailwindThemeSemanticPaletteObject).shades !== null
  );
}

function normalizeSemanticColorObject(value: Exclude<TailwindThemeSeverityColor, string>): {
  shades: TailwindThemeSemanticShades;
  on?: TailwindThemeSemanticShades;
} {
  if (isSemanticPaletteObject(value)) {
    return { shades: value.shades, on: value.on };
  }
  return { shades: value as TailwindThemeSemanticShades };
}

/** Default `--color-on-<semantic>-<shade>` values aligned with `tailwind.css` `@theme`. */
function defaultOnColorForShade(semantic: TailwindThemeSemantic, shade: TailwindThemeColorShade): string {
  const shadeNum = Number(shade);
  switch (semantic) {
    case 'warning':
      return shadeNum >= 700 ? '#ffffff' : 'var(--color-neutral-900)';
    case 'neutral':
      return shadeNum >= 600 ? '#ffffff' : 'var(--color-neutral-900)';
    default:
      return shadeNum >= 500 ? '#ffffff' : 'var(--color-neutral-900)';
  }
}

function resolveOnShadesForCustomPalette(
  semantic: TailwindThemeSemantic,
  shades: TailwindThemeSemanticShades,
  on: TailwindThemeSemanticShades | undefined
): TailwindThemeSemanticShades {
  const resolved: TailwindThemeSemanticShades = { ...on };
  for (const shade of Object.keys(shades)) {
    if (!isValidShadeKey(shade) || shades[shade] === undefined || shades[shade] === '') {
      continue;
    }
    if (resolved[shade] === undefined || resolved[shade] === '') {
      resolved[shade] = defaultOnColorForShade(semantic, shade);
    }
  }
  return resolved;
}

function pushShadeVariables(
  semantic: TailwindThemeSemantic,
  shades: TailwindThemeSemanticShades,
  entries: Array<[string, string]>
): void {
  for (const [shade, color] of Object.entries(shades)) {
    if (!isValidShadeKey(shade) || color === undefined || color === '') {
      continue;
    }
    entries.push([`--color-${semantic}-${shade}`, color]);
  }
}

function pushOnShadeVariables(
  semantic: TailwindThemeSemantic,
  on: TailwindThemeSemanticShades | undefined,
  entries: Array<[string, string]>
): void {
  if (!on) {
    return;
  }
  for (const [shade, color] of Object.entries(on)) {
    if (!isValidShadeKey(shade) || color === undefined || color === '') {
      continue;
    }
    entries.push([`--color-on-${semantic}-${shade}`, color]);
  }
}

/** Builds `[CSS custom property, value]` pairs for semantic `COLORS`. */
export function buildTailwindThemeVariableEntries(config: TailwindComponentsConfig): Array<[string, string]> {
  const colors = config.COLORS;
  if (!colors) {
    return [];
  }

  const entries: Array<[string, string]> = [];
  const dangerOrError = colors.danger ?? colors.error;

  const pairs: Array<[TailwindThemeSemantic, TailwindThemeSeverityColor | undefined]> = [
    ['primary', colors.primary],
    ['neutral', colors.neutral],
    ['success', colors.success],
    ['warning', colors.warning],
    ['danger', dangerOrError],
    ['info', colors.info]
  ];

  for (const [semantic, value] of pairs) {
    if (value === undefined) {
      continue;
    }
    if (typeof value === 'string') {
      const palette = value.trim();
      if (!palette) {
        continue;
      }
      for (const shade of shadesForSemantic(semantic)) {
        entries.push([`--color-${semantic}-${shade}`, `var(--color-${palette}-${shade})`]);
      }
    } else {
      const { shades, on } = normalizeSemanticColorObject(value);
      pushShadeVariables(semantic, shades, entries);
      pushOnShadeVariables(semantic, resolveOnShadesForCustomPalette(semantic, shades, on), entries);
    }
  }

  return entries;
}

/**
 * Builds an `@layer theme` stylesheet from semantic `COLORS`.
 *
 * Tailwind v4 registers semantic tokens in `@layer theme`, so overrides must live in the same layer
 * to win over the defaults.
 */
export function buildTailwindThemeCss(colors: TailwindDefineThemeColors): string {
  const entries = buildTailwindThemeVariableEntries({ COLORS: colors });
  if (entries.length === 0) {
    return '';
  }
  const declarations = entries.map(([prop, val]) => `  ${prop}: ${val};`).join('\n');
  return `@layer theme {\n  :root[${TAILWIND_THEME_HTML_ATTR}],\n  :host {\n${declarations}\n  }\n}`;
}

function stylesheetHasPrimaryUtility(document: Document): boolean {
  for (const sheet of document.styleSheets) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (let i = 0; i < rules.length; i++) {
      const text = rules[i]?.cssText ?? '';
      if (text.includes('.bg-primary-600') || text.includes('.bg-primary-600:')) {
        return true;
      }
    }
  }
  return false;
}

function warnIfSemanticUtilitiesMissing(document: Document): void {
  if (typeof ngDevMode !== 'undefined' && ngDevMode === false) {
    return;
  }
  if (stylesheetHasPrimaryUtility(document)) {
    return;
  }
  console.warn(
    '[angular-tailwind-components] Semantic utilities such as `.bg-primary-600` were not found in the compiled CSS. ' +
      'Add `angular-tailwind-components/styles/tailwind.css` to your global styles (it already includes `@import "tailwindcss"`). ' +
      'Using only `@import "tailwindcss"` in your app does not register `primary` / `on-primary` tokens — buttons may look gray.'
  );
}

/** Injects or updates `#tailwind-theme-colors` in `document.head` and marks `<html>`. */
export function applyTailwindThemeColors(document: Document, colors: TailwindDefineThemeColors): void {
  const entries = buildTailwindThemeVariableEntries({ COLORS: colors });
  const existing = document.getElementById(TAILWIND_THEME_STYLE_ID);
  const root = document.documentElement;

  if (entries.length === 0) {
    existing?.remove();
    root.removeAttribute(TAILWIND_THEME_HTML_ATTR);
    return;
  }

  root.setAttribute(TAILWIND_THEME_HTML_ATTR, '');

  const style = existing ?? document.createElement('style');
  style.id = TAILWIND_THEME_STYLE_ID;
  style.dataset['tailwindTheme'] = '';
  style.textContent = buildTailwindThemeCss(colors);

  if (!existing) {
    document.head.appendChild(style);
  }
  warnIfSemanticUtilitiesMissing(document);
}
