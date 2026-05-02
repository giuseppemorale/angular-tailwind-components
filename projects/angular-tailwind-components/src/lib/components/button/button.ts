import { Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { AtcSize, AtcVariant } from '../../models';

@Component({
  selector: 'atc-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [ngClass]="computedClasses()"
      [disabled]="disabled() || loading()"
      [type]="type()"
      [attr.aria-busy]="loading() || null"
      [attr.aria-disabled]="disabled() || null"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <svg
          class="atc-btn-spinner"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      }
      <span [class.opacity-0]="loading() && !iconOnly()">
        <ng-content />
      </span>
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .atc-btn-spinner {
      animation: atc-spin 1s linear infinite;
      width: 1em;
      height: 1em;
    }

    @keyframes atc-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
})
export class AtcButton {
  /** Visual style variant */
  variant = input<AtcVariant>('primary');
  /** Size of the button */
  size = input<AtcSize>('md');
  /** Whether the button is disabled */
  disabled = input<boolean>(false);
  /** Whether to show loading spinner */
  loading = input<boolean>(false);
  /** HTML button type attribute */
  type = input<'button' | 'submit' | 'reset'>('button');
  /** Make the button full width */
  fullWidth = input<boolean>(false);
  /** Icon-only mode (no text) */
  iconOnly = input<boolean>(false);

  /** Emitted when the button is clicked (not disabled/loading) */
  clicked = output<MouseEvent>();

  /** Computed Tailwind classes based on variant, size, and state */
  computedClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center gap-2',
      'font-medium',
      'transition-all duration-150 ease-in-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'cursor-pointer',
    ];

    const variantMap: Record<AtcVariant, string> = {
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

    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-5 py-2.5 rounded-lg',
      xl: 'text-base px-6 py-3 rounded-lg',
    };

    const iconSizeMap: Record<AtcSize, string> = {
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
