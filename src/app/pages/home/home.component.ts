import { Component, computed, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAlertModule,
  TailwindBadgeModule,
  TailwindButtonModule,
  TailwindCardModule,
  TailwindCarouselModule,
  TailwindChipModule,
  TailwindDividerModule,
  TailwindEmptyStateModule,
  TailwindSegmentedControlModule,
  TailwindTableModule,
  TailwindTagModule,
  TailwindTitleModule,
  TailwindTooltipModule,
  type TailwindBreadcrumbItem,
  type TailwindColor,
  type TailwindOption
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import { TABLE_STATUS_META, TableRow, TableRowStatus } from './interface/table-row.interface';
import { TABLE_DATA } from './data/data';

/** Valore del filtro: uno stato del ciclo di vita oppure "tutti". */
type StatusFilter = TableRowStatus | 'all';

@Component({
  imports: [
    HeaderComponent,
    TailwindTitleModule,
    TailwindCardModule,
    TailwindAlertModule,
    TailwindBadgeModule,
    TailwindDividerModule,
    TailwindButtonModule,
    TailwindCarouselModule,
    TailwindSegmentedControlModule,
    TailwindEmptyStateModule,
    TailwindTableModule,
    TailwindTooltipModule,
    TailwindTagModule,
    TailwindChipModule,
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

  /** Righe demo per `tailwind-table` (chiavi i18n in `nameKey`). */
  readonly tableRows: TableRow[] = TABLE_DATA;

  /** Opzioni di `tailwind-segmented-control` per filtrare il catalogo. */
  readonly statusFilterOptions: TailwindOption<StatusFilter>[] = [
    { value: 'all', label: this.transloco.translate('HOME.FILTER_ALL') },
    { value: 'stable', label: this.transloco.translate('HOME.TABLE_STATUS_STABLE') },
    { value: 'beta', label: this.transloco.translate('HOME.TABLE_STATUS_BETA') },
    { value: 'deprecated', label: this.transloco.translate('HOME.TABLE_STATUS_DEPRECATED') }
  ];

  readonly statusFilter = signal<StatusFilter | null>('all');

  readonly filteredRows = computed<TableRow[]>(() => {
    const filter = this.statusFilter();
    if (!filter || filter === 'all') {
      return this.tableRows;
    }
    return this.tableRows.filter(row => row.status === filter);
  });

  /** Chip rimovibili per la demo interattiva. */
  readonly activeChips = signal(['Angular', 'TypeScript', 'Tailwind CSS']);

  /** Colore del tag di stato. Il contesto di `*tailwindTableRow` è `any`, quindi la riga è tipizzata qui. */
  statusColor(row: TableRow): TailwindColor {
    return TABLE_STATUS_META[row.status].color;
  }

  /** Chiave i18n dell'etichetta di stato. */
  statusLabelKey(row: TableRow): string {
    return TABLE_STATUS_META[row.status].labelKey;
  }

  removeChip(label: string): void {
    this.activeChips.update(chips => chips.filter(chip => chip !== label));
  }

  resetFilter(): void {
    this.statusFilter.set('all');
  }
}
