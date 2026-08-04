import { Component, computed, input } from '@angular/core';
import { TailwindColor } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css'
})
export class TailwindTag extends TailwindComponent {
  readonly color = input<TailwindColor>('secondary');

  readonly computedClasses = computed(() => {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-600 text-on-primary-600',
      secondary: 'bg-neutral-600 text-on-neutral-600',
      success: 'bg-success-700 text-on-success-700',
      warning: 'bg-warning-500 text-on-warning-500',
      danger: 'bg-danger-700 text-on-danger-700',
      info: 'bg-info-600 text-on-info-600',
      transparent: 'bg-transparent text-neutral-700 border border-neutral-300'
    };
    return this.mergeClasses(
      'inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
      colorMap[this.color()]
    );
  });
}
