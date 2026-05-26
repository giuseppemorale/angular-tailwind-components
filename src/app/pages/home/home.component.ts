import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAlert,
  TailwindBadge,
  TailwindButton,
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
    TranslocoPipe
  ],
  selector: 'app-page-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb: TailwindBreadcrumbItem[] = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' }
  ];

  /** Righe demo per `tailwind-table` (chiavi i18n in `nameKey` / `statusKey`). */
  readonly tableRows: TableRow[] = TABLE_DATA;
}
