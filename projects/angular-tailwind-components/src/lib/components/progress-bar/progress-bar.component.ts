import { Component, computed, input } from '@angular/core';
import { AtcSeverity, AtcSize } from '../../models';

@Component({
  selector: 'atc-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
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
