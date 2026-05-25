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
  readonly tableRows: TableRow[] = [
    { nameKey: 'HOME.TABLE_ROW_INPUT', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_BUTTON', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TEXTAREA', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_CHECKBOX', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_RADIO', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SELECT', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_TOGGLE', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_UPLOAD', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_INPUT_OTP', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_DATE_PICKER', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TIME_PICKER', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_BADGE', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_CARD', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TITLE', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TAG', color: 'red', statusKey: 'HOME.TABLE_STATUS_DEPRECATED' },
    { nameKey: 'HOME.TABLE_ROW_ALERT', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SPINNER', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_PROGRESS', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TOAST', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_NOTIFICATION', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_MESSAGE', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TABS', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_PAGINATION', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_MENU', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_MODAL', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TABLE', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TOOLBAR', color: 'green', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SLIDER', color: 'amber', statusKey: 'HOME.TABLE_STATUS_BETA' }
  ];
}
