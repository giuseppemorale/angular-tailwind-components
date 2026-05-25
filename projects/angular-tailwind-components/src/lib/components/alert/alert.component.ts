import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { TailwindPalette } from '../../models';
import { feedbackSurfaceClasses } from '../../utils/palette.util';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindButton],
  selector: 'tailwind-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindAlert extends TailwindComponent {
  /** Tailwind palette family */
  readonly color = input<TailwindPalette>('sky');
  /** Alert title */
  readonly title = input<string>('');
  /** Whether the alert can be dismissed */
  readonly dismissible = input<boolean>(false);
  /** Whether to show a border on the left */
  readonly bordered = input<boolean>(true);

  /** Emitted when the alert is dismissed */
  readonly onDismiss = output<void>();

  /** Internal dismissed state */
  readonly dismissed = signal(false);

  readonly alertIcon = computed((): 'check-circle' | 'exclamation-triangle' | 'x-circle' | 'information-circle' => {
    const map: Partial<
      Record<TailwindPalette, 'check-circle' | 'exclamation-triangle' | 'x-circle' | 'information-circle'>
    > = {
      green: 'check-circle',
      amber: 'exclamation-triangle',
      red: 'x-circle',
      sky: 'information-circle'
    };
    return map[this.color()] ?? 'information-circle';
  });

  readonly computedClasses = computed(() => {
    const base = 'flex gap-3 p-4 rounded-lg';
    const borderClass = this.bordered() ? 'border-l-4' : 'border';
    return `${base} ${feedbackSurfaceClasses(this.color())} ${borderClass}`;
  });

  dismiss(): void {
    this.dismissed.set(true);
    this.onDismiss.emit();
  }
}
