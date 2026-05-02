import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TailwindSize, TailwindVariant } from '../../models';

@Component({
  selector: 'tailwind-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class TailwindButton {
  /** Visual style variant */
  readonly variant = input<TailwindVariant>('primary');
  /** Size of the button */
  readonly size = input<TailwindSize>('md');
  /** Whether the button is disabled */
  readonly disabled = input<boolean>(false);
  /** Whether to show loading spinner */
  readonly loading = input<boolean>(false);
  /** HTML button type attribute */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** Make the button full width */
  readonly fullWidth = input<boolean>(false);
  /** Icon-only mode (no text) */
  readonly iconOnly = input<boolean>(false);

  /** Emitted when the button is clicked (not disabled/loading) */
  readonly clicked = output<MouseEvent>();

  /** Computed Tailwind classes based on variant, size, and state */
  readonly computedClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium',
      'transition-all duration-150 ease-in-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'cursor-pointer',
    ];

    const variantMap: Record<TailwindVariant, string> = {
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:outline-primary-600 shadow-sm',
      secondary:
        'bg-surface-100 text-surface-800 hover:bg-surface-200 active:bg-surface-300 focus-visible:outline-surface-500 shadow-sm border border-surface-300',
      outline:
        'bg-transparent text-primary-600 border-2 border-primary-600 hover:bg-primary-50 active:bg-primary-100 focus-visible:outline-primary-600',
      ghost:
        'bg-transparent text-surface-700 hover:bg-surface-100 active:bg-surface-200 focus-visible:outline-surface-500',
      danger:
        'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800 focus-visible:outline-danger-600 shadow-sm',
      success:
        'bg-success-600 text-white hover:bg-success-700 active:bg-success-800 focus-visible:outline-success-600 shadow-sm',
      warning:
        'bg-warning-500 text-surface-900 hover:bg-warning-600 active:bg-warning-700 focus-visible:outline-warning-500 shadow-sm',
      info:
        'bg-info-600 text-white hover:bg-info-700 active:bg-info-800 focus-visible:outline-info-600 shadow-sm',
    };

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-5 py-2.5 rounded-lg',
      xl: 'text-base px-6 py-3 rounded-lg',
    };

    const iconSizeMap: Record<TailwindSize, string> = {
      xs: 'p-1 rounded-sm',
      sm: 'p-1.5 rounded-md',
      md: 'p-2 rounded-md',
      lg: 'p-2.5 rounded-lg',
      xl: 'p-3 rounded-lg',
    };

    return [
      ...base,
      variantMap[this.variant()],
      this.iconOnly() ? iconSizeMap[this.size()] : sizeMap[this.size()],
      this.fullWidth() ? 'w-full' : '',
    ].join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
