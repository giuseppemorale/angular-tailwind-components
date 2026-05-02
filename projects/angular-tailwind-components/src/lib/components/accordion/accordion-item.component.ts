import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'tailwind-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
})
export class TailwindAccordionItem {
  title = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly isExpanded = signal(false);

  toggle(): void {
    if (!this.disabled()) this.isExpanded.update(v => !v);
  }
}
