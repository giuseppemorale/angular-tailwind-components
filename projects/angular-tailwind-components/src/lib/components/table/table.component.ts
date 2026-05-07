import { Component, computed, effect, input, output, signal } from '@angular/core';
import { Pagination, TailwindPagination } from '../pagination/pagination.component';
import { TailwindTableColumn } from './interfaces/table-column.interface';
import { TailwindComponent } from '../tailwind.component';

export type { TailwindTableColumn };

@Component({
  selector: 'tailwind-table',
  imports: [TailwindPagination],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TailwindTable extends TailwindComponent {
  readonly columns = input<TailwindTableColumn[]>([]);
  readonly data = input<Record<string, any>[]>([]);
  readonly selectable = input<boolean>(false);
  readonly striped = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>('No data available');

  // --- Pagination Inputs ---
  readonly paginated = input<boolean>(true);
  readonly pagination = input<Pagination>();

  // --- Outputs ---
  readonly onSortChange = output<{ key: string; direction: 'asc' | 'desc' }>();
  readonly onSelectionChange = output<Set<number>>();

  // --- Internal State ---
  readonly sortKey = signal<string>('');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly selectedRows = signal<Set<number>>(new Set());
  readonly currentPage = signal<number>(1);

  constructor() {
    super();
    effect(() => {
      const fromInput = this.pagination()?.currentPage;
      if (fromInput != null && fromInput >= 1) {
        this.currentPage.set(fromInput);
      }
    });
  }

  // --- Computed ---
  readonly sortedData = computed(() => {
    let rows = [...this.data()];
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDir() === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const va = a[key],
          vb = b[key];
        if (va < vb) return -dir;
        if (va > vb) return dir;
        return 0;
      });
    }
    return rows;
  });

  readonly displayedData = computed(() => {
    const rows = this.sortedData();
    if (!this.paginated()) return rows;
    const size = this.pagination()?.pageSize ?? 10;
    const page = this.currentPage();
    return rows.slice((page - 1) * size, page * size);
  });

  // --- Methods ---
  sort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1); // Reset to first page on sort
    this.onSortChange.emit({ key: this.sortKey(), direction: this.sortDir() });
  }

  toggleSelection(index: number): void {
    this.selectedRows.update(s => {
      const next = new Set(s);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    this.onSelectionChange.emit(this.selectedRows());
  }
}
