import { Component, input, output } from '@angular/core';

@Component({
  selector: 'atc-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class AtcForm {
  gap = input<string>('4');
  submitted = output<void>();
}
