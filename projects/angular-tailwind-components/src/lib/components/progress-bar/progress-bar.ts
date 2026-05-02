import { Component, computed, input } from '@angular/core';
import { AtcSeverity, AtcSize } from '../../models';

@Component({
  selector: 'atc-progress-bar',
  standalone: true,
  template: `
    <div class="w-full">
      @if (showLabel()) {
        <div class="flex justify-between items-center mb-1.5">
          @if (label()) {
            <span class="text-sm font-medium text-surface-700">{{ label() }}</span>
          }
          @if (showValue()) {
            <span class="text-sm font-medium text-surface-600">{{ clampedValue() }}%</span>
          }
        </div>
      }

      <div
        [class]="trackClasses()"
        role="progressbar"
        [attr.aria-valuenow]="clampedValue()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="100"
        [attr.aria-label]="label() || 'Progress'"
      >
        <div
          [class]="barClasses()"
          [style.width.%]="indeterminate() ? 100 : clampedValue()"
        ></div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    @keyframes atc-indeterminate {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }

    .atc-progress-indeterminate {
      animation: atc-indeterminate 1.5s ease-in-out infinite;
      width: 40% !important;
    }
  `,
})
export class AtcProgressBar {
  /** Current value (0-100) */
  value = input<number>(0);
  /** Label text */
  label = input<string>('');
  /** Show the label row */
  showLabel = input<boolean>(true);
  /** Show percentage value */
  showValue = input<boolean>(true);
  /** Color variant */
  variant = input<AtcSeverity | 'primary'>('primary');
  /** Size variant */
  size = input<AtcSize>('md');
  /** Indeterminate mode (animated) */
  indeterminate = input<boolean>(false);
  /** Whether to use striped pattern */
  striped = input<boolean>(false);

  clampedValue = computed(() => Math.max(0, Math.min(100, this.value())));

  trackClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
      xl: 'h-5',
    };

    return `w-full bg-surface-200 rounded-full overflow-hidden ${sizeMap[this.size()]}`;
  });

  barClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-500',
      danger: 'bg-danger-600',
      info: 'bg-info-600',
    };

    const base = [
      'h-full rounded-full transition-all duration-300 ease-out',
      variantMap[this.variant()] ?? variantMap['primary'],
    ];

    if (this.indeterminate()) {
      base.push('atc-progress-indeterminate');
    }

    if (this.striped()) {
      base.push(
        'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_100%]'
      );
    }

    return base.join(' ');
  });
}
