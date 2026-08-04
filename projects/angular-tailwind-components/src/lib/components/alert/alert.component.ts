import { Component, computed, input, output, signal } from '@angular/core';
import { TailwindColor } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindButton],
  selector: 'tailwind-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class TailwindAlert extends TailwindComponent {
  /** Semantic color */
  readonly color = input<TailwindColor>('info');
  /** Alert title */
  readonly title = input<string>('');
  /** Whether the alert can be dismissed */
  readonly dismissible = input<boolean>(false);
  /** Whether to show a border on the left */
  readonly bordered = input<boolean>(true);
  /** Renders the projected `[tailwind-alert-actions]` slot below the message */
  readonly showActions = input<boolean>(false);

  /** Emitted when the alert is dismissed */
  readonly onDismiss = output<void>();

  /** Internal dismissed state */
  readonly dismissed = signal(false);

  readonly computedClasses = computed(() => {
    const base = 'flex gap-3 p-4 rounded-lg';
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-100 text-primary-800 border-primary-300',
      secondary: 'bg-neutral-100 text-neutral-800 border-neutral-300',
      success: 'bg-success-100 text-success-800 border-success-300',
      warning: 'bg-warning-100 text-warning-800 border-warning-300',
      danger: 'bg-danger-100 text-danger-800 border-danger-300',
      info: 'bg-info-100 text-info-800 border-info-300',
      transparent: 'bg-transparent text-neutral-700 border-neutral-300'
    };
    const borderClass = this.bordered() ? 'border-l-4' : 'border';

    return this.mergeClasses(base, colorMap[this.color()], borderClass);
  });

  dismiss(): void {
    this.dismissed.set(true);
    this.onDismiss.emit();
  }
}
