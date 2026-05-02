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
  standalone: true,
  template: `
    <div class="w-full overflow-x-auto rounded-xl border border-surface-200">
      <table class="w-full text-sm text-left">
        <thead class="bg-surface-50 border-b border-surface-200">
          <tr>
            @for (col of columns(); track col.key) {
              <th scope="col" class="px-4 py-3 font-semibold text-surface-700 whitespace-nowrap"
                [class.text-center]="col.align === 'center'" [class.text-right]="col.align === 'right'"
                [style.width]="col.width || 'auto'">
                @if (col.sortable) {
                  <button type="button" (click)="sort(col.key)" class="inline-flex items-center gap-1 cursor-pointer hover:text-surface-900 transition-colors">
                    {{ col.label }}
                    <svg class="w-3.5 h-3.5 text-surface-400" [class.text-primary-600]="sortKey() === col.key" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      @if (sortKey() === col.key && sortDir() === 'asc') {
                        <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
                      } @else {
                        <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
                      }
                    </svg>
                  </button>
                } @else {
                  {{ col.label }}
                }
              </th>
            }
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          @for (row of displayedData(); track $index) {
            <tr class="hover:bg-surface-50/50 transition-colors"
              [class.bg-primary-50/30]="selectedRows().has($index)"
              (click)="selectable() && toggleSelection($index)">
              @for (col of columns(); track col.key) {
                <td class="px-4 py-3 text-surface-700" [class.text-center]="col.align === 'center'" [class.text-right]="col.align === 'right'">
                  {{ row[col.key] }}
                </td>
              }
            </tr>
          } @empty {
            <tr><td [attr.colspan]="columns().length" class="px-4 py-8 text-center text-surface-400">{{ emptyMessage() }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `:host { display: block; }`,
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
