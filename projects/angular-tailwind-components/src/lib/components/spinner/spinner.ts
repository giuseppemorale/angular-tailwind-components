import { Component, computed, input } from '@angular/core';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-spinner',
  standalone: true,
  template: `
    <div
      [class]="containerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <svg
        [class]="spinnerClasses()"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      @if (label()) {
        <span [class]="labelClasses()">{{ label() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    @keyframes atc-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .atc-spinner-svg {
      animation: atc-spin 0.75s linear infinite;
    }
  `,
})
export class AtcSpinner {
  /** Size variant */
  size = input<AtcSize>('md');
  /** Color — uses Tailwind text color class */
  color = input<string>('text-primary-600');
  /** Optional label text */
  label = input<string>('');
  /** Aria label for accessibility */
  ariaLabel = input<string>('Loading');
  /** Layout orientation */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-2';
    const orient = this.orientation() === 'vertical' ? 'flex-col' : '';
    return `${base} ${orient}`;
  });

  spinnerClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    return `atc-spinner-svg ${sizeMap[this.size()]} ${this.color()}`;
  });

  labelClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg',
    };

    return `${sizeMap[this.size()]} ${this.color()} font-medium`;
  });
}
