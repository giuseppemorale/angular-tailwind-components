import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
import { TailwindTable } from './table.component';

const ROWS = [
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'Editor' },
  { name: 'Carol', email: 'carol@example.com', role: 'Viewer' }
];

@Component({
  imports: [TailwindTable, TailwindTableRowDirective],
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

  it('should render search input when searchable is true', () => {
    expect(fixture.nativeElement.querySelector('tailwind-input')).toBeTruthy();
  });

  it('should render default search label', () => {
    expect(fixture.nativeElement.querySelector('label')?.textContent?.trim()).toBe('Cerca');
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

    const names = [...fixture.nativeElement.querySelectorAll('.row-name')].map(
      (el: Element) => el.textContent?.trim()
    );
    expect(names).toEqual(['Bob']);
  });

  it('should match any field when filtering', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('tailwind-input input');
    input.value = 'carol@example.com';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const names = [...fixture.nativeElement.querySelectorAll('.row-name')].map(
      (el: Element) => el.textContent?.trim()
    );
    expect(names).toEqual(['Carol']);
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
