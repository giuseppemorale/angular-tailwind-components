import { Component, computed, input, output, signal } from '@angular/core';
import { AtcSeverity } from '../../models';

@Component({
  selector: 'atc-notification',
  standalone: true,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class AtcNotification {
  title = input<string>('');
  severity = input<AtcSeverity>('info');
  dismissible = input<boolean>(true);
  showActions = input<boolean>(false);
  dismissed$ = output<void>();
  dismissed = signal(false);

  computedClasses = computed(() => {
    const variantMap: Record<AtcSeverity, string> = {
      success: 'bg-success-50 border-success-200 text-success-800',
      warning: 'bg-warning-50 border-warning-200 text-warning-800',
      danger: 'bg-danger-50 border-danger-200 text-danger-800',
      info: 'bg-info-50 border-info-200 text-info-800',
    };
    return `rounded-xl border p-4 ${variantMap[this.severity()]}`;
  });

  dismiss(): void { this.dismissed.set(true); this.dismissed$.emit(); }
}
