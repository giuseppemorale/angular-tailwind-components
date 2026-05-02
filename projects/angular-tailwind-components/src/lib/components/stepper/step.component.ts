import { Component, input, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-step',
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss'
})
export class TailwindStep extends TailwindComponent {
  label = input.required<string>();
  readonly description = input<string>('');
  readonly optional = input<boolean>(false);
  readonly completed = signal(false);
  readonly isActive = signal(false);
}
