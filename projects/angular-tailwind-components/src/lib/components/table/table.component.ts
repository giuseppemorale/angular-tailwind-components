import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { DEFAULT_PAGINATION_LENGTH_OPTIONS, Pagination, TailwindPagination } from '../pagination/pagination.component';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindInput } from '../input/input.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindTableSortHost } from './interfaces/tailwind-table-sort-host';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
import { TAILWIND_LABELS, TAILWIND_PAGINATION_SUMMARY } from '../../tokens';
export type { TailwindTableSortHost };

@Component({
  selector: 'tailwind-table',
  imports: [NgTemplateOutlet, TailwindPagination, TailwindIcon, TailwindInput],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tw-sort-key]': 'sortKey()',
    '[attr.data-tw-sort-dir]': 'sortDir()'
  }
})
export class TailwindTable extends TailwindComponent implements TailwindTableSortHost {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly tailwindPaginationSummary = inject(TAILWIND_PAGINATION_SUMMARY, { optional: true });

  private readonly labels = inject(TAILWIND_LABELS);

  readonly data = input<any[]>([]);
  readonly searchable = input<boolean>(true);
  /** Visible label of the search field; defaults to `TAILWIND_LABELS.search`. */
  readonly searchLabel = input<string>('');
  /** Placeholder of the search field; defaults to `TAILWIND_LABELS.searchPlaceholder`. */
  readonly searchPlaceholder = input<string>('');
  readonly selectable = input<boolean>(false);
  readonly striped = input<boolean>(false);
  readonly loading = input<boolean>(false);
  /** Message shown when there are no rows; defaults to `TAILWIND_LABELS.noData`. */
  readonly emptyMessage = input<string>('');

  protected readonly searchLabelText = computed(() => this.searchLabel() || this.labels.search);
  protected readonly searchPlaceholderText = computed(() => this.searchPlaceholder() || this.labels.searchPlaceholder);
  protected readonly emptyMessageText = computed(() => this.emptyMessage() || this.labels.noData);
  protected readonly loadingText = computed(() => this.labels.loading);
  /** Match your column count so the empty state spans the full table width. */
  readonly emptyColspan = input<number>(1);

  readonly paginated = input<boolean>(true);
  readonly pagination = input<Pagination>();
  readonly paginationSummary = computed(
    () => this.pagination()?.summary ?? this.tailwindPaginationSummary ?? 'Showing {start}-{end} of {total}'
  );
  readonly paginationLengthOptions = computed(
    () => this.pagination()?.lengthOptions ?? [...DEFAULT_PAGINATION_LENGTH_OPTIONS]
  );

  /** Emits the indices of the selected rows **within `data()`** (stable across sort, search and paging). */
  readonly onSelectionChange = output<Set<number>>();
  readonly onSortChange = output<{ key: string; direction: 'asc' | 'desc' }>();

  readonly rowTemplate = contentChild.required(TailwindTableRowDirective);

  /** Row reference → index in `data()`, so selection survives sorting, filtering and paging. */
  private readonly dataIndexByRow = computed(() => {
    const map = new Map<unknown, number>();
    this.data().forEach((row, i) => map.set(row, i));
    return map;
  });

  /**
   * One context object per displayed row, rebuilt only when the rows, the selection or the
   * relevant inputs change (previously rebuilt on every change detection pass).
   */
  readonly rowContexts = computed(() => {
    const indexByRow = this.dataIndexByRow();
    const striped = this.striped();
    const selectable = this.selectable();
    const selected = this.selectedRows();

    return this.displayedData().map((row, index) => {
      const dataIndex = indexByRow.get(row) ?? index;
      return {
        $implicit: row,
        /** Position within the current page (display and zebra striping). */
        index,
        /** Position within `data()` — the identity used for selection. */
        dataIndex,
        stripedRow: striped && index % 2 === 1,
        selected: selected.has(dataIndex),
        selectable,
        toggleRow: () => {
          if (!this.selectable()) return;
          this.toggleSelection(dataIndex);
        }
      };
    });
  });

  readonly sortKey = signal<string>('');
  readonly sortDir = signal<'asc' | 'desc'>('asc');
  readonly searchQuery = signal('');
  readonly selectedRows = signal<Set<number>>(new Set());
  readonly currentPage = signal<number>(1);
  readonly pageSize = signal<number>(10);

  constructor() {
    super();
    effect(() => {
      const fromInput = this.pagination()?.currentPage;
      if (fromInput != null && fromInput >= 1) {
        this.currentPage.set(fromInput);
      }
    });
    effect(() => {
      const fromInput = this.pagination()?.pageSize;
      if (fromInput != null && fromInput > 0) {
        this.pageSize.set(fromInput);
      }
    });
    effect(() => {
      if (!this.loading()) {
        untracked(() => queueMicrotask(() => this.applyColumnHeaderScope()));
      }
    });
    afterNextRender(() => this.applyColumnHeaderScope());
  }

  /** Projected `<thead>` is compiled in the parent; set `scope="col"` on header cells here. */
  private applyColumnHeaderScope(): void {
    this.elementRef.nativeElement.querySelectorAll('thead th:not([scope])').forEach((th: Element) => {
      th.setAttribute('scope', 'col');
    });
  }

  readonly filteredData = computed(() => {
    const rows = this.data();
    const query = this.searchQuery().trim().toLowerCase();
    if (!this.searchable() || !query) return rows;
    return rows.filter(row =>
      Object.values(row).some(value => value != null && String(value).toLowerCase().includes(query))
    );
  });

  readonly sortedData = computed(() => {
    const rows = [...this.filteredData()];
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
    const size = this.pageSize();
    const page = this.currentPage();
    return rows.slice((page - 1) * size, page * size);
  });

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

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

  /** Toggles the row at `dataIndex` (index within `data()`, not within the current page). */
  toggleSelection(dataIndex: number): void {
    this.selectedRows.update(s => {
      const next = new Set(s);
      if (next.has(dataIndex)) next.delete(dataIndex);
      else next.add(dataIndex);
      return next;
    });
    this.onSelectionChange.emit(this.selectedRows());
  }

  /** The selected rows themselves, in `data()` order. */
  readonly selectedItems = computed(() => {
    const selected = this.selectedRows();
    return this.data().filter((_, i) => selected.has(i));
  });

  /** True when every row matching the current search is selected (`false` for an empty result). */
  readonly allFilteredSelected = computed(() => {
    const rows = this.sortedData();
    if (rows.length === 0) return false;
    const indexByRow = this.dataIndexByRow();
    const selected = this.selectedRows();
    return rows.every(row => selected.has(indexByRow.get(row) ?? -1));
  });

  /** True when some — but not all — filtered rows are selected (drives a header `indeterminate` box). */
  readonly someFilteredSelected = computed(() => {
    const rows = this.sortedData();
    if (rows.length === 0) return false;
    const indexByRow = this.dataIndexByRow();
    const selected = this.selectedRows();
    const hit = rows.some(row => selected.has(indexByRow.get(row) ?? -1));
    return hit && !this.allFilteredSelected();
  });

  /** Selects or clears every row matching the current search (not just the current page). */
  toggleAllFiltered(): void {
    if (!this.selectable()) return;
    const indexByRow = this.dataIndexByRow();
    const indices = this.sortedData()
      .map(row => indexByRow.get(row) ?? -1)
      .filter(i => i >= 0);

    this.selectedRows.update(s => {
      const next = new Set(s);
      if (this.allFilteredSelected()) indices.forEach(i => next.delete(i));
      else indices.forEach(i => next.add(i));
      return next;
    });
    this.onSelectionChange.emit(this.selectedRows());
  }

  /** Clears the whole selection. */
  clearSelection(): void {
    if (this.selectedRows().size === 0) return;
    this.selectedRows.set(new Set());
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
