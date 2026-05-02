import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'atc-step',
  standalone: true,
  templateUrl: './step.component.html',
  styleUrl: './step.component.scss',
})
export class AtcStep {
  label = input.required<string>();
  description = input<string>('');
  optional = input<boolean>(false);
  completed = signal(false);
  isActive = signal(false);
}
