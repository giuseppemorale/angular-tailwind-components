import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
import { TailwindSortHeaderDirective } from '../../directives/table/tailwind-sort-header.directive';
import { TailwindSelectAllHeaderDirective } from '../../directives/table/tailwind-select-all-header.directive';
import { TailwindTable } from './table.component';
import { DEFAULT_TAILWIND_LABELS, resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';

const ROWS = [
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  { name: 'Carol', email: 'carol@example.com', role: 'Viewer' }
];

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [searchable]="searchable" [paginated]="false">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td class="row-name">{{ row.name }}</td>
          <td>{{ row.email }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class TableHostComponent {
  rows = ROWS;
  searchable = true;
}

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [searchable]="false" [paginated]="false">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td>{{ row.name }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class TableNoSearchHostComponent {
  rows = ROWS;
}

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [paginated]="true">
      <div tailwind-table-tools data-testid="table-tools">
        <button type="button">Refresh</button>
      </div>
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td>{{ row.name }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class TableWithToolsHostComponent {
  rows = ROWS;
}

@Component({
  imports: [TailwindTable, TailwindTableRowDirective, TailwindSortHeaderDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [searchable]="false" [paginated]="false">
      <thead>
        <tr>
          <th tailwindSortHeader sortKey="name">Name</th>
          <th tailwindSortHeader sortKey="role">Role</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td class="row-name">{{ row.name }}</td>
          <td>{{ row.role }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class SortableTableHostComponent {
  // Deliberately unsorted, so the first click has a visible effect.
  rows = [ROWS[2], ROWS[1], ROWS[0]];
}

const DATED = [
  { name: 'First', due: new Date('2024-03-01'), amount: 100, note: 'c' },
  { name: 'Second', due: new Date('2024-01-10'), amount: 40, note: null },
  { name: 'Third', due: new Date('2024-02-02'), amount: 5, note: 'a' }
];

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [searchable]="false" [paginated]="false" [sortComparators]="comparators">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td class="row-name">{{ row.name }}</td>
          <td class="row-amount">{{ row.amount }}</td>
          <td class="row-note">{{ row.note }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class DatedTableHostComponent {
  readonly table = viewChild.required(TailwindTable);
  rows = DATED;
  comparators = {
    due: (a: (typeof DATED)[number], b: (typeof DATED)[number]) => a.due.getTime() - b.due.getTime()
  };
}

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table
      [data]="rows"
      [serverSide]="true"
      [pagination]="{ totalItems: 300, pageSize: 10, currentPage: 1 }"
      (pageChange)="lastPageChange = $event">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td class="row-name">{{ row.name }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class ServerTableHostComponent {
  readonly table = viewChild.required(TailwindTable);
  rows = ROWS;
  lastPageChange: { page: number; pageSize: number } | null = null;
}

@Component({
  imports: [TailwindTable, TailwindTableRowDirective, TailwindSelectAllHeaderDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [selectable]="true" [searchable]="false" [paginated]="false">
      <thead>
        <tr>
          <th tailwindSelectAllHeader></th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody *tailwindTableRow="let row">
        <tr>
          <td class="row-name">{{ row.name }}</td>
        </tr>
      </tbody>
    </tailwind-table>
  `
})
class SelectableTableHostComponent {
  readonly table = viewChild.required(TailwindTable);
  rows = ROWS;
}

describe('TailwindTable', () => {
  let fixture: ComponentFixture<TableHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should set scope="col" on projected thead th elements', () => {
    const headers = [...fixture.nativeElement.querySelectorAll('thead th')] as HTMLElement[];
    expect(headers.length).toBeGreaterThan(0);
    for (const th of headers) {
      expect(th.getAttribute('scope')).toBe('col');
    }
  });

  it('should render search input when searchable is true', () => {
    expect(fixture.nativeElement.querySelector('tailwind-input')).toBeTruthy();
  });

  it('should render the default search label from TAILWIND_LABELS', () => {
    expect(fixture.nativeElement.querySelector('label')?.textContent?.trim()).toBe(DEFAULT_TAILWIND_LABELS.search);
  });

  it('should use the app-wide TAILWIND_LABELS override for the search label', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: TAILWIND_LABELS, useValue: resolveTailwindLabels({ search: 'Cerca' }) }]
    });

    const localized = TestBed.createComponent(TableHostComponent);
    localized.detectChanges();

    expect(localized.nativeElement.querySelector('label')?.textContent?.trim()).toBe('Cerca');
  });

  it('should hide search input when searchable is false', () => {
    const noSearchFixture = TestBed.createComponent(TableNoSearchHostComponent);
    noSearchFixture.detectChanges();

    expect(noSearchFixture.nativeElement.querySelector('tailwind-input')).toBeNull();
  });

  it('should filter rows with OR across all fields', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('tailwind-input input');
    input.value = 'editor';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const names = [...fixture.nativeElement.querySelectorAll('.row-name')].map((el: Element) => el.textContent?.trim());
    expect(names).toEqual(['Bob']);
  });

  it('should match any field when filtering', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('tailwind-input input');
    input.value = 'carol@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const names = [...fixture.nativeElement.querySelectorAll('.row-name')].map((el: Element) => el.textContent?.trim());
    expect(names).toEqual(['Carol']);
  });

  it('should keep pagination outside the horizontal scroll container', () => {
    const paginatedFixture = TestBed.createComponent(TableWithToolsHostComponent);
    paginatedFixture.detectChanges();

    const pagination = paginatedFixture.nativeElement.querySelector('tailwind-pagination');
    const scrollContainer = paginatedFixture.nativeElement.querySelector('.overflow-x-auto');
    expect(pagination).toBeTruthy();
    expect(scrollContainer).toBeTruthy();
    expect(scrollContainer.contains(pagination)).toBe(false);
  });

  it('should project table tools beside search', () => {
    const toolsFixture = TestBed.createComponent(TableWithToolsHostComponent);
    toolsFixture.detectChanges();

    expect(toolsFixture.nativeElement.querySelector('[data-testid="table-tools"]')).toBeTruthy();
    expect(toolsFixture.nativeElement.querySelector('.justify-between')).toBeTruthy();
  });

  describe('sortable headers', () => {
    let sortFixture: ComponentFixture<SortableTableHostComponent>;

    beforeEach(() => {
      sortFixture = TestBed.createComponent(SortableTableHostComponent);
      sortFixture.detectChanges();
    });

    afterEach(() => sortFixture.destroy());

    function header(index = 0): HTMLElement {
      return sortFixture.nativeElement.querySelectorAll('th[data-sort-key]')[index] as HTMLElement;
    }

    function names(): (string | undefined)[] {
      return [...sortFixture.nativeElement.querySelectorAll('.row-name')].map((el: Element) => el.textContent?.trim());
    }

    it('should expose the column as an unsorted columnheader', () => {
      expect(header().getAttribute('role')).toBe('columnheader');
      expect(header().getAttribute('aria-sort')).toBe('none');
      expect(header().getAttribute('aria-label')).toBe(DEFAULT_TAILWIND_LABELS.sortBy.replace('{column}', 'name'));
    });

    it('should sort through DI when the header is clicked, with no table reference passed', () => {
      header().click();
      sortFixture.detectChanges();

      expect(names()).toEqual(['Alice', 'Bob', 'Carol']);
      expect(header().getAttribute('aria-sort')).toBe('ascending');
      expect(header().getAttribute('aria-label')).toBe(DEFAULT_TAILWIND_LABELS.sortedAscending);
    });

    it('should reverse the direction on a second activation', () => {
      header().click();
      sortFixture.detectChanges();
      header().click();
      sortFixture.detectChanges();

      expect(names()).toEqual(['Carol', 'Bob', 'Alice']);
      expect(header().getAttribute('aria-sort')).toBe('descending');
    });

    it('should sort from the keyboard with Enter and Space', () => {
      header().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      sortFixture.detectChanges();
      expect(header().getAttribute('aria-sort')).toBe('ascending');

      header().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      sortFixture.detectChanges();
      expect(header().getAttribute('aria-sort')).toBe('descending');
    });

    it('should move the active marker when another column takes over', () => {
      header(0).click();
      sortFixture.detectChanges();
      header(1).click();
      sortFixture.detectChanges();

      expect(header(0).getAttribute('aria-sort')).toBe('none');
      expect(header(1).getAttribute('aria-sort')).toBe('ascending');
    });

    it('should render a sort indicator icon inside the header', () => {
      expect(header().querySelector('tailwind-icon')).toBeTruthy();
    });
  });

  describe('sorting', () => {
    it('should sort dates chronologically through a column comparator', () => {
      const dated = TestBed.createComponent(DatedTableHostComponent);
      dated.detectChanges();

      const table = dated.componentInstance.table();
      table.sort('due');
      dated.detectChanges();

      const labels = [...dated.nativeElement.querySelectorAll('.row-name')].map((el: Element) =>
        el.textContent?.trim()
      );
      // String comparison would have put 02/02 before 10/01; the comparator orders by time.
      expect(labels).toEqual(['Second', 'Third', 'First']);
    });

    it('should order numbers numerically by default, not as strings', () => {
      const dated = TestBed.createComponent(DatedTableHostComponent);
      dated.detectChanges();

      dated.componentInstance.table().sort('amount');
      dated.detectChanges();

      const amounts = [...dated.nativeElement.querySelectorAll('.row-amount')].map((el: Element) =>
        Number(el.textContent?.trim())
      );
      expect(amounts).toEqual([5, 40, 100]);
    });

    it('should put null values last regardless of direction', () => {
      const dated = TestBed.createComponent(DatedTableHostComponent);
      dated.detectChanges();

      dated.componentInstance.table().sort('note');
      dated.detectChanges();

      const notes = [...dated.nativeElement.querySelectorAll('.row-note')].map((el: Element) => el.textContent?.trim());
      expect(notes[notes.length - 1]).toBe('');
    });
  });

  describe('server-side mode', () => {
    it('should render rows untouched and report page changes instead of slicing', () => {
      const server = TestBed.createComponent(ServerTableHostComponent);
      server.detectChanges();

      const table = server.componentInstance.table();
      // Only one page worth of rows was provided, but the pager knows there are 300.
      expect(server.nativeElement.querySelectorAll('.row-name').length).toBe(3);
      expect(table.totalItems()).toBe(300);

      table.goToPage(4);
      server.detectChanges();

      expect(server.componentInstance.lastPageChange).toEqual({ page: 4, pageSize: 10 });
      // The rows are still whatever the caller supplied — the table did not re-slice them.
      expect(server.nativeElement.querySelectorAll('.row-name').length).toBe(3);
    });

    it('should not filter locally when the caller owns the query', () => {
      const server = TestBed.createComponent(ServerTableHostComponent);
      server.detectChanges();

      server.componentInstance.table().onSearchChange('nothing matches this');
      server.detectChanges();

      expect(server.nativeElement.querySelectorAll('.row-name').length).toBe(3);
    });
  });

  describe('select all header', () => {
    it('should select every filtered row and expose the mixed state', () => {
      const selectable = TestBed.createComponent(SelectableTableHostComponent);
      selectable.detectChanges();

      const box: HTMLInputElement = selectable.nativeElement.querySelector('thead input[type="checkbox"]');
      expect(box).toBeTruthy();
      expect(box.checked).toBe(false);

      box.click();
      selectable.detectChanges();

      const table = selectable.componentInstance.table();
      expect(table.selectedItems().length).toBe(3);
      expect(table.allFilteredSelected()).toBe(true);

      table.toggleSelection(0);
      selectable.detectChanges();
      expect(table.someFilteredSelected()).toBe(true);
      expect(selectable.nativeElement.querySelector('thead input[type="checkbox"]').indeterminate).toBe(true);
    });
  });

  it('should show all rows when search query is empty', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('tailwind-input input');
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.row-name').length).toBe(0);

    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.row-name').length).toBe(3);
  });
});
