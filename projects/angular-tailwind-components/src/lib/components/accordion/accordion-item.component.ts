import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'atc-accordion-item',
  standalone: true,
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.scss',
})
export class AtcAccordionItem {
  title = input.required<string>();
  disabled = input<boolean>(false);
  isExpanded = signal(false);

  toggle(): void {
    if (!this.disabled()) this.isExpanded.update(v => !v);
  }
}
