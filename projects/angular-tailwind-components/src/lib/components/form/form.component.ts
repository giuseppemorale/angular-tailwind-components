import { Component, input, output } from '@angular/core';

@Component({
  selector: 'tailwind-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class TailwindForm {
  readonly gap = input<string>('4');
  readonly submitted = output<void>();
}
