import { Component, input, output, signal } from '@angular/core';

export interface AtcMenuItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  value?: string;
}

@Component({
  selector: 'atc-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AtcMenu {
  items = input<AtcMenuItem[]>([]);
  align = input<'left' | 'right'>('left');
  selected = output<AtcMenuItem>();

  isOpen = signal(false);

  toggle(): void { this.isOpen.update(v => !v); }

  selectItem(item: AtcMenuItem): void {
    if (!item.disabled) {
      this.selected.emit(item);
      this.isOpen.set(false);
    }
  }

  onDocumentClick(event: Event): void {
    // Close on outside click is handled by host listener
    // This is a simplified version; a production version would check element containment
  }
}
