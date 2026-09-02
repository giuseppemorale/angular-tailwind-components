import { NgModule } from '@angular/core';
import { TailwindTable } from './table.component';
import { TailwindTableRowDirective } from '../../directives/table/tailwind-table-row.directive';
import { TailwindSortHeaderDirective } from '../../directives/table/tailwind-sort-header.directive';
import { TailwindSelectAllHeaderDirective } from '../../directives/table/tailwind-select-all-header.directive';

/** Table with its row template and sortable / select-all header directives. */
@NgModule({
  imports: [TailwindTable, TailwindTableRowDirective, TailwindSortHeaderDirective, TailwindSelectAllHeaderDirective],
  exports: [TailwindTable, TailwindTableRowDirective, TailwindSortHeaderDirective, TailwindSelectAllHeaderDirective]
})
export class TailwindTableModule {}
