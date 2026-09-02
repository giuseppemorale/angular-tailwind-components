import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindTableModule } from './table.module';

// Il modulo è l'unico import dell'host: se una delle tre direttive non è esportata, il template non si applica.
@Component({
  imports: [TailwindTableModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-table [data]="rows" [selectable]="true" [searchable]="false" [paginated]="false">
      <thead>
        <tr>
          <th tailwindSelectAllHeader></th>
          <th tailwindSortHeader sortKey="name">Name</th>
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
class TableModuleHostComponent {
  readonly rows = [{ name: 'Alice' }, { name: 'Bob' }];
}

describe('TailwindTableModule', () => {
  it('should expose table, row template and header directives to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [TableModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TableModuleHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.row-name').length).toBe(2);
    expect(fixture.nativeElement.querySelector('th[aria-sort]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('th[tailwindSelectAllHeader] tailwind-checkbox')).toBeTruthy();
  });
});
