import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TailwindSeverity } from '../../models';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindButton],
  selector: 'tailwind-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindNotification extends TailwindComponent {
  readonly title = input<string>('');
  readonly severity = input<TailwindSeverity>('info');
  readonly dismissible = input<boolean>(true);
  readonly showActions = input<boolean>(false);

  readonly onDismiss = output<void>();

  readonly computedClasses = computed(() => {
    const variantMap: Record<TailwindSeverity, string> = {
      success: 'bg-success-50 border-success-200 text-on-success-50',
      warning: 'bg-warning-50 border-warning-200 text-on-warning-50',
      danger: 'bg-danger-50 border-danger-200 text-on-danger-50',
      info: 'bg-info-50 border-info-200 text-on-info-50'
    };
    return `flex items-start rounded-lg border p-4 ${variantMap[this.severity()]}`;
  });
}
