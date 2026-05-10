import { Component, computed, input, output } from '@angular/core';
import { TailwindSeverity } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class TailwindNotification extends TailwindComponent {
  readonly title = input<string>('');
  readonly severity = input<TailwindSeverity>('info');
  readonly dismissible = input<boolean>(true);
  readonly showActions = input<boolean>(false);

  readonly onDismiss = output<void>();

  readonly computedClasses = computed(() => {
    const variantMap: Record<TailwindSeverity, string> = {
      success: 'bg-success-50 border-success-200 text-success-800',
      warning: 'bg-warning-50 border-warning-200 text-warning-800',
      danger: 'bg-danger-50 border-danger-200 text-danger-800',
      info: 'bg-info-50 border-info-200 text-info-800'
    };
    return `flex items-start rounded-xl border p-4 ${variantMap[this.severity()]}`;
  });
}
