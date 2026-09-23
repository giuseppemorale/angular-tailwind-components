import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrl: './accordion-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindAccordionItem extends TailwindComponent {
  /** Panel heading; replaced by content projected into `[tailwind-accordion-header]`. */
  readonly title = input<string>();
  /** When true the panel never expands and ignores toggle attempts. */
  readonly disabled = input<boolean>(false);
  readonly isExpanded = signal(false);

  /** Emitted whenever the panel is expanded or collapsed. */
  readonly toggled = output<void>();

  toggle(): void {
    if (!this.disabled()) {
      this.isExpanded.update(v => !v);
      this.toggled.emit();
    }
  }
}
