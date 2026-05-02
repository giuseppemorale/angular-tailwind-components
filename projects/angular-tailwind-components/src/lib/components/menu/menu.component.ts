import { Component, input, output, signal } from '@angular/core';
import { TailwindMenuItem } from './interfaces/menu-item.interface';
import { TailwindComponent } from '../tailwind.component';

export type { TailwindMenuItem };

@Component({
  selector: 'tailwind-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class TailwindMenu extends TailwindComponent {
  readonly items = input<TailwindMenuItem[]>([]);
  readonly align = input<'left' | 'right'>('left');
  readonly onSelect = output<TailwindMenuItem>();

  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update(v => !v);
  }

  selectItem(item: TailwindMenuItem): void {
    if (!item.disabled) {
      this.onSelect.emit(item);
      this.isOpen.set(false);
    }
  }

  onDocumentClick(event: Event): void {
    // Close on outside click is handled by host listener
  }
}
