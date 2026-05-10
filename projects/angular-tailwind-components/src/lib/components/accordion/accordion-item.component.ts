import { Component, input, output, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'tailwind-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css'
})
export class TailwindAccordionItem extends TailwindComponent {
  readonly title = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly isExpanded = signal(false);

  readonly onToggle = output<void>();

  toggle(): void {
    if (!this.disabled()) {
      this.isExpanded.update(v => !v);
      this.onToggle.emit();
    }
  }
}
