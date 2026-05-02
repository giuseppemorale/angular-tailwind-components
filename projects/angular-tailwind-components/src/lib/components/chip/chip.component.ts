import { Component, computed, input, output } from '@angular/core';
import { TailwindSeverity, TailwindSize } from '../../models';

@Component({
  selector: 'tailwind-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss'
})
export class TailwindChip {
  readonly variant = input<TailwindSeverity | 'neutral' | 'primary'>('neutral');
  readonly size = input<TailwindSize>('md');
  readonly removable = input<boolean>(false);
  readonly onRemove = output<void>();

  readonly computedClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-100 text-primary-700 border-primary-200',
      neutral: 'bg-surface-100 text-surface-700 border-surface-200',
      success: 'bg-success-100 text-success-700 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      danger: 'bg-danger-100 text-danger-700 border-danger-200',
      info: 'bg-info-100 text-info-700 border-info-200'
    };
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5'
    };
    return `inline-flex items-center font-medium rounded-full border ${variantMap[this.variant()]} ${sizeMap[this.size()]}`;
  });
}
