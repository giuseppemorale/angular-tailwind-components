import { applyTailwindRadius, buildTailwindRadiusCss, resolveTailwindRadiusScale } from './theme-radius';
import { TAILWIND_RADIUS_HTML_ATTR, TAILWIND_RADIUS_STYLE_ID } from '../properties/constant';

describe('radius scale', () => {
  afterEach(() => {
    document.getElementById(TAILWIND_RADIUS_STYLE_ID)?.remove();
    document.documentElement.removeAttribute(TAILWIND_RADIUS_HTML_ATTR);
  });

  it('resolves each preset to explicit per-role lengths', () => {
    expect(resolveTailwindRadiusScale('sharp')).toEqual({ control: '0px', surface: '0px', overlay: '0px' });
    expect(resolveTailwindRadiusScale('round').control).toBe('0.75rem');
  });

  it('falls back to the default scale for roles a partial config omits', () => {
    const scale = resolveTailwindRadiusScale({ control: '0.375rem' });
    expect(scale.control).toBe('0.375rem');
    expect(scale.surface).toBe('0.75rem');
    expect(scale.overlay).toBe('0.875rem');
  });

  it('derives the nested radius with calc so it follows whatever the role is set to', () => {
    const css = buildTailwindRadiusCss('round');
    expect(css).toContain('--radius-control: 0.75rem;');
    expect(css).toContain('--radius-control-inner: max(0px, calc(var(--radius-control) - 0.125rem));');
  });

  it('writes the scale into a single style element and reuses it on re-apply', () => {
    applyTailwindRadius(document, 'compact');
    const first = document.getElementById(TAILWIND_RADIUS_STYLE_ID);
    expect(first?.textContent).toContain('--radius-control: 0.25rem;');
    expect(document.documentElement.hasAttribute(TAILWIND_RADIUS_HTML_ATTR)).toBe(true);

    applyTailwindRadius(document, 'round');
    expect(document.querySelectorAll(`#${TAILWIND_RADIUS_STYLE_ID}`).length).toBe(1);
    expect(document.getElementById(TAILWIND_RADIUS_STYLE_ID)?.textContent).toContain('--radius-control: 0.75rem;');
  });
});
