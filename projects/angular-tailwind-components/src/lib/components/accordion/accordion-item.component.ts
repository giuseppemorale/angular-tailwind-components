import { Component, input, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss'
})
export class TailwindAccordionItem extends TailwindComponent {
  title = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly isExpanded = signal(false);

  toggle(): void {
    if (!this.disabled()) this.isExpanded.update(v => !v);
  }
}
