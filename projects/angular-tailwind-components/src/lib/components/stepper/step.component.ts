import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'tailwind-step',
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class TailwindStep {
  label = input.required<string>();
  readonly description = input<string>('');
  readonly optional = input<boolean>(false);
  readonly completed = signal(false);
  readonly isActive = signal(false);
}
