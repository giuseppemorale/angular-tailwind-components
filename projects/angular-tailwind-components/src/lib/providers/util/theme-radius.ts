import type { TailwindRadiusConfig, TailwindRadiusScale } from '../types/theme-config.types';
import { RADIUS_PRESETS, TAILWIND_RADIUS_HTML_ATTR, TAILWIND_RADIUS_STYLE_ID } from '../properties/constant';

/** Resolves a preset name or a partial scale into explicit per-role lengths. */
export function resolveTailwindRadiusScale(config: TailwindRadiusConfig): Required<TailwindRadiusScale> {
  if (typeof config === 'string') {
    return { ...(RADIUS_PRESETS[config] ?? RADIUS_PRESETS.default) };
  }
  return {
    control: config.control ?? RADIUS_PRESETS.default.control,
    surface: config.surface ?? RADIUS_PRESETS.default.surface,
    overlay: config.overlay ?? RADIUS_PRESETS.default.overlay
  };
}

/**
 * Builds the `@layer theme` stylesheet for a radius scale.
 *
 * The `*-inner` tokens use `calc()` over their role so nested elements stay concentric at every
 * preset — including `sharp`, where the result clamps to square.
 */
export function buildTailwindRadiusCss(config: TailwindRadiusConfig): string {
  const { control, surface, overlay } = resolveTailwindRadiusScale(config);
  return [
    '@layer theme {',
    `  :root[${TAILWIND_RADIUS_HTML_ATTR}],`,
    '  :host {',
    `    --radius-control: ${control};`,
    '    --radius-control-inner: max(0px, calc(var(--radius-control) - 0.125rem));',
    `    --radius-surface: ${surface};`,
    '    --radius-surface-inner: max(0px, calc(var(--radius-surface) - 0.25rem));',
    `    --radius-overlay: ${overlay};`,
    '  }',
    '}'
  ].join('\n');
}

/** Injects or updates `#tailwind-theme-radius` in `document.head` and marks `<html>`. */
export function applyTailwindRadius(document: Document, config: TailwindRadiusConfig): void {
  document.documentElement.setAttribute(TAILWIND_RADIUS_HTML_ATTR, '');

  const existing = document.getElementById(TAILWIND_RADIUS_STYLE_ID);
  const style = existing ?? document.createElement('style');
  style.id = TAILWIND_RADIUS_STYLE_ID;
  style.textContent = buildTailwindRadiusCss(config);

  if (!existing) {
    document.head.appendChild(style);
  }
}
