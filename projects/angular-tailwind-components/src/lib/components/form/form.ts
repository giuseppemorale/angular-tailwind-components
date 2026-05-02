import { Component, input, output } from '@angular/core';

@Component({
  selector: 'atc-form',
  standalone: true,
  template: `
    <form (ngSubmit)="submitted.emit()" [class]="'flex flex-col gap-' + gap()" novalidate>
      <ng-content />
    </form>
  `,
  styles: `:host { display: block; }`,
})
export class AtcForm {
  gap = input<string>('4');
  submitted = output<void>();
}
