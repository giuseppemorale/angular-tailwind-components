import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindCard,
  TailwindDivider,
  TailwindSelect,
  TailwindTab,
  TailwindTabGroup,
  TailwindTitle,
  TailwindToggle,
  type TailwindOption
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    HeaderComponent,
    TailwindTitle,
    TailwindCard,
    TailwindTabGroup,
    TailwindTab,
    TailwindToggle,
    TailwindDivider,
    TailwindSelect,
    TranslocoPipe
  ],
  selector: 'app-page-settings',
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb = [
    { label: 'Home', link: '/', icon: 'home' },
    { label: 'Impostazioni', link: '/settings' }
  ];

  readonly densityOptions: TailwindOption<string>[] = [
    { value: 'comfortable', label: this.transloco.translate('SETTINGS.DENSITY_COMFORTABLE') },
    { value: 'compact', label: this.transloco.translate('SETTINGS.DENSITY_COMPACT') }
  ];

  readonly theme = model<string | null>('comfortable');
  readonly tabIndex = model(0);
}
