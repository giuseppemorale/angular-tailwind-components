import { Component, computed, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TailwindSize, TailwindColor, TailwindButtonKind } from '../../models';
import { TAILWIND_BUTTON_KIND } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class TailwindButton extends TailwindComponent {
  private readonly defaultKind = inject(TAILWIND_BUTTON_KIND, { optional: true });

  /** Visual color */
  readonly color = input<TailwindColor>('primary');
  /**
   * Visual kind: `flat` = filled like `solid` without border or shadow;
   * `ghost` = transparent with hover tint; `text` = text color only, no hover background.
   * Default from {@link TAILWIND_BUTTON_KIND} or `'solid'`.
   */
  readonly kind = input<TailwindButtonKind>(this.defaultKind ?? 'solid');
  /** Size of the button */
  readonly size = input<TailwindSize>('md');
  /** Whether the button is disabled */
  readonly disabled = input<boolean>(false);
  /** HTML button type attribute */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /** Emitted when the button is clicked (not disabled). */
  readonly onClick = output<MouseEvent>();

  /** Computed Tailwind classes based on color, kind, size, and state */
  readonly computedClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium',
      'transition-all duration-150 ease-in-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'cursor-pointer',
      'border'
    ];

    const solidMap: Record<TailwindColor, string> = {
      primary:
        'bg-primary-600 text-on-primary-600 hover:bg-primary-700 hover:text-on-primary-700 active:bg-primary-800 active:text-on-primary-800 border-transparent focus-visible:outline-primary-600 shadow-sm',
      secondary:
        'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border-neutral-300 focus-visible:outline-neutral-500 shadow-sm',
      danger:
        'bg-danger-600 text-on-danger-600 hover:bg-danger-700 hover:text-on-danger-700 active:bg-danger-800 active:text-on-danger-800 border-transparent focus-visible:outline-danger-600 shadow-sm',
      success:
        'bg-success-600 text-on-success-600 hover:bg-success-700 hover:text-on-success-700 active:bg-success-800 active:text-on-success-800 border-transparent focus-visible:outline-success-600 shadow-sm',
      warning:
        'bg-warning-500 text-on-warning-500 hover:bg-warning-600 hover:text-on-warning-600 active:bg-warning-700 active:text-on-warning-700 border-transparent focus-visible:outline-warning-500 shadow-sm',
      info:
        'bg-info-600 text-on-info-600 hover:bg-info-700 hover:text-on-info-700 active:bg-info-800 active:text-on-info-800 border-transparent focus-visible:outline-info-600 shadow-sm'
    };

    /** Filled surface like `solid`, without box shadow or visible border. */
    const flatMap: Record<TailwindColor, string> = {
      primary:
        'bg-primary-600 text-on-primary-600 hover:bg-primary-700 hover:text-on-primary-700 active:bg-primary-800 active:text-on-primary-800 border-0 shadow-none focus-visible:outline-primary-600',
      secondary:
        'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 active:bg-neutral-300 border-0 shadow-none focus-visible:outline-neutral-500',
      danger:
        'bg-danger-600 text-on-danger-600 hover:bg-danger-700 hover:text-on-danger-700 active:bg-danger-800 active:text-on-danger-800 border-0 shadow-none focus-visible:outline-danger-600',
      success:
        'bg-success-600 text-on-success-600 hover:bg-success-700 hover:text-on-success-700 active:bg-success-800 active:text-on-success-800 border-0 shadow-none focus-visible:outline-success-600',
      warning:
        'bg-warning-500 text-on-warning-500 hover:bg-warning-600 hover:text-on-warning-600 active:bg-warning-700 active:text-on-warning-700 border-0 shadow-none focus-visible:outline-warning-500',
      info:
        'bg-info-600 text-on-info-600 hover:bg-info-700 hover:text-on-info-700 active:bg-info-800 active:text-on-info-800 border-0 shadow-none focus-visible:outline-info-600'
    };

    const outlinedMap: Record<TailwindColor, string> = {
      primary:
        'bg-transparent text-primary-600 border-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-primary-600',
      secondary:
        'bg-transparent text-neutral-700 border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100 focus-visible:outline-neutral-500',
      danger:
        'bg-transparent text-danger-600 border-danger-600 hover:bg-danger-50 active:bg-danger-100 focus-visible:outline-danger-600',
      success:
        'bg-transparent text-success-600 border-success-600 hover:bg-success-50 active:bg-success-100 focus-visible:outline-success-600',
      warning:
        'bg-transparent text-warning-600 border-warning-500 hover:bg-warning-50 active:bg-warning-100 focus-visible:outline-warning-500',
      info: 'bg-transparent text-info-600 border-info-600 hover:bg-info-50 active:bg-info-100 focus-visible:outline-info-600'
    };

    /** Transparent + hover/active background tint (former `text` look). */
    const ghostMap: Record<TailwindColor, string> = {
      primary:
        'bg-transparent text-primary-600 border-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-primary-600',
      secondary:
        'bg-transparent text-neutral-700 border-transparent hover:bg-neutral-100 active:bg-neutral-200 focus-visible:outline-neutral-500',
      danger:
        'bg-transparent text-danger-600 border-transparent hover:bg-danger-50 active:bg-danger-100 focus-visible:outline-danger-600',
      success:
        'bg-transparent text-success-600 border-transparent hover:bg-success-50 active:bg-success-100 focus-visible:outline-success-600',
      warning:
        'bg-transparent text-warning-600 border-transparent hover:bg-warning-50 active:bg-warning-100 focus-visible:outline-warning-500',
      info: 'bg-transparent text-info-600 border-transparent hover:bg-info-50 active:bg-info-100 focus-visible:outline-info-600'
    };

    /** Text color from severity only; background stays transparent on hover/active. */
    const textMap: Record<TailwindColor, string> = {
      primary: 'bg-transparent text-primary-600 border-transparent focus-visible:outline-primary-600',
      secondary: 'bg-transparent text-neutral-700 border-transparent focus-visible:outline-neutral-500',
      danger: 'bg-transparent text-danger-600 border-transparent focus-visible:outline-danger-600',
      success: 'bg-transparent text-success-600 border-transparent focus-visible:outline-success-600',
      warning: 'bg-transparent text-warning-600 border-transparent focus-visible:outline-warning-500',
      info: 'bg-transparent text-info-600 border-transparent focus-visible:outline-info-600'
    };

    const styleMap = {
      solid: solidMap,
      flat: flatMap,
      outlined: outlinedMap,
      ghost: ghostMap,
      text: textMap
    };

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-5 py-2.5 rounded-lg',
      xl: 'text-base px-6 py-3 rounded-lg'
    };

    const iconSizeMap: Record<TailwindSize, string> = {
      xs: 'p-1 rounded-sm',
      sm: 'p-1.5 rounded-md',
      md: 'p-2 rounded-md',
      lg: 'p-2.5 rounded-lg',
      xl: 'p-3 rounded-lg'
    };

    return [...base, styleMap[this.kind()][this.color()] || styleMap['solid']['primary'], sizeMap[this.size()]].join(
      ' '
    );
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.onClick.emit(event);
    }
  }
}
