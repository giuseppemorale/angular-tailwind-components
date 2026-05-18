import { Component, computed, input } from '@angular/core';
import { TailwindSeverity } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TailwindTag extends TailwindComponent {
  readonly variant = input<TailwindSeverity | 'neutral' | 'primary'>('neutral');

  readonly computedClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-600 text-on-primary-600',
      neutral: 'bg-neutral-600 text-on-neutral-600',
      success: 'bg-success-600 text-on-success-600',
      warning: 'bg-warning-500 text-on-warning-500',
      danger: 'bg-danger-600 text-on-danger-600',
      info: 'bg-info-600 text-on-info-600'
    };
    return `inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${variantMap[this.variant()]}`;
  });
}
