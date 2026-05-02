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
  standalone: true,
  template: `
    <div class="relative inline-block">
      <div (click)="toggle()">
        <ng-content select="[atcMenuTrigger]" />
      </div>

      @if (isOpen()) {
        <div class="absolute z-[1000] mt-1 min-w-[12rem] bg-white rounded-xl border border-surface-200 shadow-lg py-1 animate-in fade-in slide-in-from-top-1"
             [class.right-0]="align() === 'right'" [class.left-0]="align() === 'left'"
             role="menu">
          @for (item of items(); track item.label) {
            @if (item.divider) {
              <hr class="my-1 border-surface-100" />
            } @else {
              <button type="button" role="menuitem" [disabled]="!!item.disabled"
                class="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                (click)="selectItem(item)">
                {{ item.label }}
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  styles: `:host { display: inline-block; }`,
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
