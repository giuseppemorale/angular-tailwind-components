import { NgTemplateOutlet } from '@angular/common';
import { Component, HostListener, computed, contentChild, effect, input, output, signal } from '@angular/core';
import { Pagination, TailwindPagination } from '../pagination/pagination.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindTableSortHost } from './interfaces/tailwind-table-sort-host';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
export type { TailwindTableSortHost };

@Component({
  selector: 'tailwind-table',
  imports: [NgTemplateOutlet, TailwindPagination],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  host: {
    '[attr.data-tw-sort-key]': 'sortKey()',
    '[attr.data-tw-sort-dir]': 'sortDir()'
  }
})
export class TailwindTable extends TailwindComponent implements TailwindTableSortHost {
  readonly data = input<any[]>([]);
  readonly selectable = input<boolean>(false);
  readonly striped = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly emptyMessage = input<string>('No data available');
  /** Match your column count so the empty state spans the full table width. */
  readonly emptyColspan = input<number>(1);

  readonly paginated = input<boolean>(true);
  readonly pagination = input<Pagination>();

  readonly onSortChange = output<{ key: string; direction: 'asc' | 'desc' }>();
  readonly onSelectionChange = output<Set<number>>();

  readonly rowTemplate = contentChild.required(TailwindTableRowDirective);

  rowContext(row: Record<string, unknown>, index: number): Record<string, unknown> {
    return {
      $implicit: row,
      index,
      stripedRow: this.striped() && index % 2 === 1,
      selected: this.selectedRows().has(index),
      selectable: this.selectable(),
      toggleRow: () => {
        if (!this.selectable()) return;
        this.toggleSelection(index);
      }
    };
  }

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

  readonly sortedData = computed(() => {
    let rows = [...this.data()];
    const key = this.sortKey();
    if (key) {
      const dir = this.sortDir() === 'asc' ? 1 : -1;
      rows.sort((a, b) => {
        const va = a[key],
          vb = b[key];
        const sa = va == null ? '' : String(va);
        const sb = vb == null ? '' : String(vb);
        const cmp = sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
        return dir * cmp;
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

  sort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
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

  @HostListener('click', ['$event'])
  protected onSortZoneClick(ev: Event): void {
    this.delegateSortFromEvent(ev);
  }

  @HostListener('keydown', ['$event'])
  protected onSortZoneKeydown(ev: KeyboardEvent): void {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const target = ev.target as HTMLElement | null;
    if (!target?.closest?.('[tailwindSortHeader]')) return;
    if (ev.key === ' ') ev.preventDefault();
    this.delegateSortFromEvent(ev);
  }

  private delegateSortFromEvent(ev: Event): void {
    const host = ev.currentTarget as HTMLElement;
    const target = ev.target as HTMLElement | null;
    const header = target?.closest?.('[tailwindSortHeader]') as HTMLElement | null;
    if (!header || !host.contains(header)) return;
    if (header.closest('tailwind-table') !== host) return;
    const key = header.getAttribute('data-sort-key');
    if (key) this.sort(key);
  }
}
