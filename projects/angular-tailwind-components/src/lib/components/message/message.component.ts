import { Component, computed, input } from '@angular/core';
import { TailwindSeverity } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class TailwindMessage extends TailwindComponent {
  readonly severity = input<TailwindSeverity>('info');

  readonly computedClasses = computed(() => {
    const variantMap: Record<TailwindSeverity, string> = {
      success: 'bg-success-50 text-success-700 border-success-200',
      warning: 'bg-warning-50 text-warning-700 border-warning-200',
      danger: 'bg-danger-50 text-danger-700 border-danger-200',
      info: 'bg-info-50 text-info-700 border-info-200'
    };
    return `text-sm px-3 py-2 rounded-lg border ${variantMap[this.severity()]}`;
  });
}
