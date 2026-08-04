import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAlert,
  TailwindBadge,
  TailwindButton,
  TailwindChip,
  TailwindCard,
  TailwindDivider,
  TailwindSortHeaderDirective,
  TailwindTable,
  TailwindTableRowDirective,
  TailwindTag,
  TailwindTitle,
  type TailwindBreadcrumbItem
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import { TableRow } from './interface/table-row.interface';
import { TABLE_DATA } from './data/data';

@Component({
  imports: [
    HeaderComponent,
    TailwindTitle,
    TailwindCard,
    TailwindAlert,
    TailwindBadge,
    TailwindDivider,
    TailwindButton,
    TailwindTable,
    TailwindTableRowDirective,
    TailwindSortHeaderDirective,
    TailwindTag,
    TailwindChip,
    TranslocoPipe
  ],
  selector: 'app-page-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb: TailwindBreadcrumbItem[] = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' }
  ];

  /** Righe demo per `tailwind-table` (chiavi i18n in `nameKey` / `statusKey`). */
  readonly tableRows: TableRow[] = TABLE_DATA;

  /** Chip rimovibili per la demo interattiva. */
  readonly activeChips = signal(['Angular', 'TypeScript', 'Tailwind CSS']);

  removeChip(label: string): void {
    this.activeChips.update(chips => chips.filter(chip => chip !== label));
  }
}
