import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-step',
  templateUrl: './step.component.html',
  styleUrl: './step.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindStep extends TailwindComponent {
  /** Step title. */
  readonly label = input.required<string>();
  /** Step subtitle. */
  readonly description = input<string>('');
  /** Marks the step as skippable. */
  readonly optional = input<boolean>(false);
  readonly completed = signal(false);
  readonly isActive = signal(false);
}
