import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, TailwindIcon],
  selector: 'tailwind-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
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
