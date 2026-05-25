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
    { nameKey: 'HOME.TABLE_ROW_INPUT', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_BUTTON', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TEXTAREA', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_CHECKBOX', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_RADIO', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SELECT', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_TOGGLE', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_UPLOAD', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_INPUT_OTP', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_DATE_PICKER', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TIME_PICKER', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_BADGE', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_CARD', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TITLE', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TAG', variant: 'danger', statusKey: 'HOME.TABLE_STATUS_DEPRECATED' },
    { nameKey: 'HOME.TABLE_ROW_ALERT', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SPINNER', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_PROGRESS', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TOAST', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_NOTIFICATION', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' },
    { nameKey: 'HOME.TABLE_ROW_MESSAGE', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TABS', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_PAGINATION', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_MENU', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_MODAL', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TABLE', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_TOOLBAR', variant: 'success', statusKey: 'HOME.TABLE_STATUS_STABLE' },
    { nameKey: 'HOME.TABLE_ROW_SLIDER', variant: 'warning', statusKey: 'HOME.TABLE_STATUS_BETA' }
  ];
}
