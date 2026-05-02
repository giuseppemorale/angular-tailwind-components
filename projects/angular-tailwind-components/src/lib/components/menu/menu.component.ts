import { Component, input, output, signal } from '@angular/core';
import { TailwindMenuItem } from './interfaces/menu-item.interface';

export type { TailwindMenuItem };

@Component({
  selector: 'tailwind-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class TailwindMenu {
  readonly items = input<TailwindMenuItem[]>([]);
  readonly align = input<'left' | 'right'>('left');
  readonly selected = output<TailwindMenuItem>();

  readonly isOpen = signal(false);

  toggle(): void { this.isOpen.update(v => !v); }

  selectItem(item: TailwindMenuItem): void {
    if (!item.disabled) {
      this.selected.emit(item);
      this.isOpen.set(false);
    }
  }

  onDocumentClick(event: Event): void {
    // Close on outside click is handled by host listener
  }
}
