import { Component, computed, input, output, signal } from '@angular/core';
import { AtcSeverity } from '../../models';

@Component({
  selector: 'atc-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AtcAlert {
  /** Severity / color variant */
  severity = input<AtcSeverity>('info');
  /** Alert title */
  title = input<string>('');
  /** Whether the alert can be dismissed */
  dismissible = input<boolean>(false);
  /** Whether to show a border on the left */
  bordered = input<boolean>(true);

  /** Emitted when the alert is dismissed */
  dismissed$ = output<void>();

  /** Internal dismissed state */
  dismissed = signal(false);

  computedClasses = computed(() => {
    const base = 'flex gap-3 p-4 rounded-lg';

    const variantMap: Record<AtcSeverity, string> = {
      success: 'bg-success-50 text-success-800 border-success-200',
      warning: 'bg-warning-50 text-warning-800 border-warning-200',
      danger: 'bg-danger-50 text-danger-800 border-danger-200',
      info: 'bg-info-50 text-info-800 border-info-200',
    };

    const borderClass = this.bordered() ? 'border-l-4' : 'border';

    return `${base} ${variantMap[this.severity()]} ${borderClass}`;
  });

  dismiss(): void {
    this.dismissed.set(true);
    this.dismissed$.emit();
  }
}
