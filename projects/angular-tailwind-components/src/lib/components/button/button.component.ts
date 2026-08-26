import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import type { TailwindHeroicon, TailwindIconPosition } from '../../models';
import { TailwindSize, TailwindColor, TailwindButtonKind, TailwindButtonRole } from '../../models';
import { TAILWIND_BUTTON_KIND, TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import {
  CONTROL_SIZE,
  CONTROL_SQUARE,
  DISABLED_PRESSABLE,
  FOCUS_RING,
  ICON_PIXEL_SIZE,
  PRESS_FEEDBACK,
  TRANSITION_CONTROL
} from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/** Always transparent background; no tint on hover, focus, or active. */
const transparentColorClasses =
  'bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent border-transparent text-neutral-600';

const base = [
  'inline-flex items-center justify-center',
  'font-medium',
  TRANSITION_CONTROL,
  PRESS_FEEDBACK,
  FOCUS_RING,
  DISABLED_PRESSABLE,
  'cursor-pointer',
  'border'
];

/**
 * Filled surfaces.
 *
 * There is deliberately no `shadow-*` here any more. A drop shadow means *this element floats above
 * the page*, which is true of a card or a menu and false of every button on a toolbar — when every
 * button carried one the page read as cluttered. What replaces it is `surface-highlight`: a 1px
 * inset white line along the top edge that catches the light and gives the fill a body, the way a
 * physical key does, without lifting it off the surface.
 */
const solidMap: Record<TailwindColor, string> = {
  primary:
    'bg-primary-600 text-on-primary-600 hover:bg-primary-700 hover:text-on-primary-700 active:bg-primary-800 active:text-on-primary-800 border-transparent surface-highlight',
  secondary: 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border-border-strong',
  danger:
    'bg-danger-600 text-on-danger-600 hover:bg-danger-700 hover:text-on-danger-700 active:bg-danger-800 active:text-on-danger-800 border-transparent surface-highlight',
  success:
    'bg-success-700 text-on-success-700 hover:bg-success-800 hover:text-on-success-800 active:bg-success-900 active:text-on-success-900 border-transparent surface-highlight',
  warning:
    'bg-warning-500 text-on-warning-500 hover:bg-warning-600 hover:text-on-warning-600 active:bg-warning-700 active:text-on-warning-700 border-transparent surface-highlight',
  info: 'bg-info-600 text-on-info-600 hover:bg-info-700 hover:text-on-info-700 active:bg-info-800 active:text-on-info-800 border-transparent surface-highlight',
  transparent: transparentColorClasses
};

/**
 * Tinted surface: a light wash of the color behind text of the same hue.
 *
 * The variant most product UIs reach for by default — it carries the semantic color without the
 * weight of a filled button, so a row of actions can share a color without any of them shouting.
 */
const softMap: Record<TailwindColor, string> = {
  primary: 'bg-primary-50 text-primary-700 border-transparent hover:bg-primary-100 active:bg-primary-200',
  secondary: 'bg-neutral-100 text-neutral-700 border-transparent hover:bg-neutral-200 active:bg-neutral-300',
  danger: 'bg-danger-50 text-danger-700 border-transparent hover:bg-danger-100 active:bg-danger-200',
  success: 'bg-success-50 text-success-800 border-transparent hover:bg-success-100 active:bg-success-200',
  warning: 'bg-warning-50 text-warning-800 border-transparent hover:bg-warning-100 active:bg-warning-200',
  info: 'bg-info-50 text-info-800 border-transparent hover:bg-info-100 active:bg-info-200',
  transparent: transparentColorClasses
};

/** Filled surface like `solid`, without the top highlight, border, or hover/active tint. */
const flatMap: Record<TailwindColor, string> = {
  primary: 'bg-primary-600 text-on-primary-600 border-transparent',
  secondary: 'bg-neutral-100 text-neutral-800 border-transparent',
  danger: 'bg-danger-600 text-on-danger-600 border-transparent',
  success: 'bg-success-700 text-on-success-700 border-transparent',
  warning: 'bg-warning-500 text-on-warning-500 border-transparent',
  info: 'bg-info-600 text-on-info-600 border-transparent',
  transparent: transparentColorClasses
};

const outlinedMap: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-primary-600 hover:bg-primary-50 active:bg-primary-100',
  secondary: 'bg-transparent text-neutral-700 border-border-strong hover:bg-neutral-50 active:bg-neutral-100',
  danger: 'bg-transparent text-danger-800 border-danger-700 hover:bg-danger-50 active:bg-danger-100',
  success: 'bg-transparent text-success-800 border-success-700 hover:bg-success-50 active:bg-success-100',
  warning: 'bg-transparent text-warning-800 border-warning-700 hover:bg-warning-50 active:bg-warning-100',
  info: 'bg-transparent text-info-800 border-info-700 hover:bg-info-50 active:bg-info-100',
  transparent: transparentColorClasses
};

/** Transparent + hover/active background tint (former `text` look). */
const ghostMap: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-transparent hover:bg-primary-50 active:bg-primary-100',
  secondary: 'bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100 active:bg-neutral-200',
  danger: 'bg-transparent text-danger-800 border-transparent hover:bg-danger-50 active:bg-danger-100',
  success: 'bg-transparent text-success-800 border-transparent hover:bg-success-50 active:bg-success-100',
  warning: 'bg-transparent text-warning-800 border-transparent hover:bg-warning-50 active:bg-warning-100',
  info: 'bg-transparent text-info-800 border-transparent hover:bg-info-50 active:bg-info-100',
  transparent: transparentColorClasses
};

/** Text color from semantic color only; background stays transparent on hover/active. */
const textMap: Record<TailwindColor, string> = {
  primary: 'bg-transparent text-primary-600 border-transparent',
  secondary: 'bg-transparent text-neutral-700 border-transparent',
  danger: 'bg-transparent text-danger-800 border-transparent',
  success: 'bg-transparent text-success-800 border-transparent',
  warning: 'bg-transparent text-warning-800 border-transparent',
  info: 'bg-transparent text-info-800 border-transparent',
  transparent: transparentColorClasses
};

const styleMap: Record<TailwindButtonKind, Record<TailwindColor, string>> = {
  solid: solidMap,
  soft: softMap,
  flat: flatMap,
  outlined: outlinedMap,
  ghost: ghostMap,
  text: textMap
};

/**
 * Square footprint when `icon` is set and the projected label is empty (icon-only).
 * The height already comes from {@link CONTROL_SIZE}; only the width and the now-wrong horizontal
 * padding need correcting, which keeps an icon-only button exactly as tall as its labelled sibling.
 */
const iconOnlySizeMap: Record<TailwindSize, string> = {
  xs: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.xs}`,
  sm: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.sm}`,
  md: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.md}`,
  lg: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.lg}`,
  xl: `has-[.tailwind-button-label:empty]:px-0 has-[.tailwind-button-label:empty]:${CONTROL_SQUARE.xl}`
};

@Component({
  imports: [NgClass, TailwindIcon],
  selector: 'tailwind-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindButton extends TailwindComponent {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

  private readonly defaultKind = inject(TAILWIND_BUTTON_KIND, { optional: true });

  /** Visual color */
  readonly color = input<TailwindColor>('primary');
  /**
   * Visual kind: `flat` = filled like `solid` without border, shadow, or hover/active background change;
   * `ghost` = transparent with hover tint; `text` = text color only, no hover background.
   * Default from {@link TAILWIND_BUTTON_KIND} or `'solid'`.
   */
  readonly kind = input<TailwindButtonKind>(this.defaultKind ?? 'solid');
  /** Size of the button */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Whether the button is disabled */
  readonly disabled = input<boolean>(false);
  /**
   * Shows a spinner in place of the icon and blocks activation while an action is in flight.
   * The label stays visible so the button does not change width mid-action.
   */
  readonly loading = input<boolean>(false);
  /** Stretches the button to the full width of its container. */
  readonly fullWidth = input<boolean>(false);
  /** HTML button type attribute */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /**
   * ARIA role. Left at `button` nothing is written: the native element already has that role and
   * a redundant attribute only adds noise. Set another value to repurpose the control
   * (`menuitem`, `tab`, `switch`, …).
   */
  readonly role = input<TailwindButtonRole>('button');
  /** Optional Heroicons outline icon inside the button */
  readonly icon = input<TailwindHeroicon | undefined>();
  /** Icon placement when both icon and label are shown */
  readonly iconPosition = input<TailwindIconPosition>('left');
  /** Accessible name for icon-only buttons */
  readonly ariaLabel = input<string>('');
  /** Toggle state for toolbar-style buttons (`aria-pressed` on the native control). */
  readonly ariaPressed = input<boolean | undefined>(undefined);
  /**
   * Marks this button as the current item of a set (`aria-current` on the native control) — the
   * active page in a pagination, the current step in a stepper, the current page in a nav.
   */
  readonly ariaCurrent = input<'page' | 'step' | 'location' | 'date' | 'time' | 'true' | undefined>(undefined);

  readonly iconPixelSize = computed(() => ICON_PIXEL_SIZE[this.size()]);

  /** A loading button is not activatable, so it is disabled at the DOM level too. */
  readonly isDisabled = computed(() => this.disabled() || this.loading());

  /** Computed Tailwind classes based on color, kind, size, and state */
  readonly computedClasses = computed(() => {
    const size = this.size();
    const sizeClasses = [
      CONTROL_SIZE[size],
      // A full-width button is never icon-only, so the square override would only fight `w-full`.
      (this.icon() || this.loading()) && !this.fullWidth() ? iconOnlySizeMap[size] : '',
      this.fullWidth() ? 'w-full' : ''
    ]
      .filter(Boolean)
      .join(' ');

    return this.mergeClasses(...base, styleMap[this.kind()][this.color()] || styleMap['solid']['primary'], sizeClasses);
  });
}
