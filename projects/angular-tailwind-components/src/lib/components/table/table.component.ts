import { Component, computed, input, model, output, signal } from '@angular/core';

export interface AtcTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'atc-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class AtcTable {
  columns = input<AtcTableColumn[]>([]);
  data = input<Record<string, any>[]>([]);
  selectable = input<boolean>(false);
  emptyMessage = input<string>('No data available');

  sortKey = signal<string>('');
  sortDir = signal<'asc' | 'desc'>('asc');
  selectedRows = signal<Set<number>>(new Set());
  sortChanged = output<{ key: string; direction: 'asc' | 'desc' }>();
  selectionChanged = output<Set<number>>();

  displayedData = computed(() => {
    let rows = [...this.data()];
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDir() === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const va = a[key], vb = b[key];
        if (va < vb) return -dir;
        if (va > vb) return dir;
        return 0;
      });
    }
    return rows;
  });

  sort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.sortChanged.emit({ key: this.sortKey(), direction: this.sortDir() });
  }

  toggleSelection(index: number): void {
    this.selectedRows.update(s => {
      const next = new Set(s);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
    this.selectionChanged.emit(this.selectedRows());
  }
}
