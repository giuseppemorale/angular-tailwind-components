import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { TailwindPagination } from '../pagination/pagination.component';
import type { Pagination } from '../pagination/interfaces/pagination.interface';
import { DEFAULT_PAGINATION_LENGTH_OPTIONS } from '../pagination/properties/constant';
import { TailwindInput } from '../input/input.component';
import { TailwindSkeleton } from '../skeleton/skeleton.component';
import { TailwindComponent } from '../tailwind.component';
import {
  TAILWIND_TABLE_SELECTION_HOST,
  TAILWIND_TABLE_SORT_HOST,
  TailwindTableSelectionHost,
  TailwindTableSortHost
} from './interfaces/tailwind-table-sort-host';
import type { TailwindTableRow } from './interfaces/table-row.type';
import type { TailwindTableSort } from './interfaces/table-sort.interface';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
import { TAILWIND_LABELS, TAILWIND_PAGINATION_SUMMARY } from '../../tokens';

@Component({
  selector: 'tailwind-table',
  imports: [NgTemplateOutlet, TailwindPagination, TailwindInput, TailwindSkeleton],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Exposed so a projected `[tailwindSortHeader]` can reach this table through DI.
  providers: [
    { provide: TAILWIND_TABLE_SORT_HOST, useExisting: forwardRef(() => TailwindTable) },
    { provide: TAILWIND_TABLE_SELECTION_HOST, useExisting: forwardRef(() => TailwindTable) }
  ]
})
export class TailwindTable<T extends object = TailwindTableRow>
  extends TailwindComponent
  implements TailwindTableSortHost, TailwindTableSelectionHost
{
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly tailwindPaginationSummary = inject(TAILWIND_PAGINATION_SUMMARY, { optional: true });

  private readonly labels = inject(TAILWIND_LABELS);

  /** Row data; search, sorting and pagination slicing are applied by the component. */
  readonly data = input<readonly T[]>([]);
  /**
   * Server-side mode: renders `data()` as given and only emits `onSortChange` / `onPageChange`.
   * Provide `pagination.totalItems` so the pager knows the full result size.
   */
  readonly serverSide = input<boolean>(false);
  /**
   * Per-column comparator replacing the default string comparison; returns a number like
   * `Array.prototype.sort`. Needed for dates and mixed types, which sort wrong as strings.
   */
  readonly sortComparators = input<Partial<Record<string, (a: T, b: T) => number>>>({});
  /** Column and direction applied on load and whenever the input changes; does not emit `sortChange`. */
  readonly defaultSort = input<TailwindTableSort | null>(null);
  /** Keeps the header row visible while the body scrolls. */
  readonly stickyHeader = input<boolean>(false);
  /** Shows the search field and filters rows across every value of the row object. */
  readonly searchable = input<boolean>(true);
  /** Visible label of the search field; defaults to `TAILWIND_LABELS.search`. */
  readonly searchLabel = input<string>('');
  /** Placeholder of the search field; defaults to `TAILWIND_LABELS.searchPlaceholder`. */
  readonly searchPlaceholder = input<string>('');
  /** Makes rows clickable for selection; pair with `toggleRow` from the row template context. */
  readonly selectable = input<boolean>(false);
  /** Alternates row background; apply `stripedRow` on the `tr`. */
  readonly striped = input<boolean>(false);
  /** Replaces the body with the loading state. */
  readonly loading = input<boolean>(false);
  /** Message shown when there are no rows; defaults to `TAILWIND_LABELS.noData`. */
  readonly emptyMessage = input<string>('');

  protected readonly searchLabelText = computed(() => this.searchLabel() || this.labels.search);
  protected readonly searchPlaceholderText = computed(() => this.searchPlaceholder() || this.labels.searchPlaceholder);
  protected readonly emptyMessageText = computed(() => this.emptyMessage() || this.labels.noData);
  protected readonly loadingText = computed(() => this.labels.loading);
  /** Match your column count so the empty state spans the full table width. */
  readonly emptyColspan = input<number>(1);

  /** Number of placeholder rows drawn while `loading` is true. */
  protected readonly skeletonRows = [0, 1, 2, 3, 4];

  /** Placeholder cell widths for the loading state; uneven so the skeleton reads as text. */
  protected readonly skeletonCells = computed(() => {
    const pattern = ['70%', '45%', '85%', '35%', '60%'];
    const columns = Math.min(Math.max(this.emptyColspan(), 1), 8);
    return Array.from({ length: columns }, (_, index) => pattern[index % pattern.length]);
  });

  /** Enables client-side pagination. */
  readonly paginated = input<boolean>(true);
  /** Pagination configuration: `totalItems`, `pageSize`, `currentPage`, `maxVisible`, `ariaLabel`, `summary`. */
  readonly pagination = input<Pagination>();
  readonly paginationSummary = computed(
    () => this.pagination()?.summary ?? this.tailwindPaginationSummary ?? 'Showing {start}-{end} of {total}'
  );
  readonly paginationLengthOptions = computed(
    () => this.pagination()?.lengthOptions ?? [...DEFAULT_PAGINATION_LENGTH_OPTIONS]
  );

  /** True when the pager is rendered; the last row keeps its rule only in that case. */
  protected readonly showPagination = computed(() => this.paginated() && this.totalItems() > 0);

  /** Emits the indices of the selected rows **within `data()`** (stable across sort, search and paging). */
  readonly selectionChange = output<Set<number>>();
  /** Column and direction requested through a sortable header. */
  readonly sortChange = output<TailwindTableSort>();
  /** Emitted whenever the page or page size changes; drives fetching in `serverSide` mode. */
  readonly pageChange = output<{ page: number; pageSize: number }>();

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
      const initial = this.defaultSort();
      if (initial?.key) {
        this.sortKey.set(initial.key);
        this.sortDir.set(initial.direction);
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
    // In server-side mode the caller has already filtered; re-filtering would hide rows.
    if (this.serverSide()) return rows;

    const query = this.searchQuery().trim().toLowerCase();
    if (!this.searchable() || !query) return rows;
    return rows.filter(row =>
      Object.values(row).some(value => value != null && String(value).toLowerCase().includes(query))
    );
  });

  /** Default comparison: numeric-aware, case-insensitive, `null` last. */
  private static compareValues(a: unknown, b: unknown): number {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  }

  readonly sortedData = computed(() => {
    const rows = [...this.filteredData()];
    if (this.serverSide()) return rows;

    const key = this.sortKey();
    if (!key) return rows;

    const dir = this.sortDir() === 'asc' ? 1 : -1;
    const comparator = this.sortComparators()[key];
    rows.sort((a, b) => {
      if (comparator) return dir * comparator(a, b);
      const read = (row: T) => (row as Record<string, unknown>)[key];
      return dir * TailwindTable.compareValues(read(a), read(b));
    });
    return rows;
  });

  readonly displayedData = computed(() => {
    const rows = this.sortedData();
    // The server already returned one page; slicing again would show a page of a page.
    if (!this.paginated() || this.serverSide()) return rows;
    const size = this.pageSize();
    const page = this.currentPage();
    return rows.slice((page - 1) * size, page * size);
  });

  /** Row count the pager works from: the server total when in server-side mode. */
  readonly totalItems = computed(() => this.pagination()?.totalItems ?? this.sortedData().length);

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.goToPage(1);
  }

  /** Moves to `page` and tells the caller, which is how server-side mode fetches the next slice. */
  goToPage(page: number): void {
    if (this.currentPage() === page) return;
    this.currentPage.set(page);
    this.pageChange.emit({ page, pageSize: this.pageSize() });
  }

  setPageSize(size: number): void {
    if (this.pageSize() === size) return;
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.pageChange.emit({ page: 1, pageSize: size });
  }

  sort(key: string): void {
    if (this.sortKey() === key) {
      this.sortDir.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.goToPage(1);
    this.sortChange.emit({ key: this.sortKey(), direction: this.sortDir() });
  }

  /** Toggles the row at `dataIndex` (index within `data()`, not within the current page). */
  toggleSelection(dataIndex: number): void {
    this.selectedRows.update(s => {
      const next = new Set(s);
      if (next.has(dataIndex)) next.delete(dataIndex);
      else next.add(dataIndex);
      return next;
    });
    this.selectionChange.emit(this.selectedRows());
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
    this.selectionChange.emit(this.selectedRows());
  }

  /** Accessible name of the header select-all checkbox. */
  protected readonly selectAllLabel = computed(() => this.labels.selectAll);

  /** Clears the whole selection. */
  clearSelection(): void {
    if (this.selectedRows().size === 0) return;
    this.selectedRows.set(new Set());
    this.selectionChange.emit(this.selectedRows());
  }
}
