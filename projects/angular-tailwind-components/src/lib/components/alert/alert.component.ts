import { Component, computed, input, output, signal } from '@angular/core';
import { TailwindSeverity } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class TailwindAlert extends TailwindComponent {
  /** Severity / color variant */
  readonly severity = input<TailwindSeverity>('info');
  /** Alert title */
  readonly title = input<string>('');
  /** Alert message */
  readonly message = input<string>('');
  /** Whether the alert can be dismissed */
  readonly dismissible = input<boolean>(false);
  /** Whether to show a border on the left */
  readonly bordered = input<boolean>(true);

  /** Emitted when the alert is dismissed */
  readonly onDismiss = output<void>();

  /** Internal dismissed state */
  readonly dismissed = signal(false);

  readonly computedClasses = computed(() => {
    const base = 'flex gap-3 p-4 rounded-lg';

    const variantMap: Record<TailwindSeverity, string> = {
      success: 'bg-success-50 text-success-800 border-success-200',
      warning: 'bg-warning-50 text-warning-800 border-warning-200',
      danger: 'bg-danger-50 text-danger-800 border-danger-200',
      info: 'bg-info-50 text-info-800 border-info-200'
    };

    const borderClass = this.bordered() ? 'border-l-4' : 'border';

    return `${base} ${variantMap[this.severity()]} ${borderClass}`;
  });

  dismiss(): void {
    this.dismissed.set(true);
    this.onDismiss.emit();
  }
}
