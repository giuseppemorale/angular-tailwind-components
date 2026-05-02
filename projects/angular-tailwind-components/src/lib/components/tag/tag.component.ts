import { Component, computed, input } from '@angular/core';
import { TailwindSeverity } from '../../models';

@Component({
  selector: 'tailwind-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TailwindTag {
  readonly variant = input<TailwindSeverity | 'neutral' | 'primary'>('neutral');

  readonly computedClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-600 text-white',
      neutral: 'bg-surface-600 text-white',
      success: 'bg-success-600 text-white',
      warning: 'bg-warning-500 text-surface-900',
      danger: 'bg-danger-600 text-white',
      info: 'bg-info-600 text-white'
    };
    return `inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${variantMap[this.variant()]}`;
  });
}
