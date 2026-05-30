import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAutocomplete,
  TailwindCard,
  TailwindDivider,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindSlider,
  TailwindTab,
  TailwindTabGroup,
  TailwindTitle,
  TailwindToggle,
  type TailwindOption
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindTitle,
    TailwindCard,
    TailwindTabGroup,
    TailwindTab,
    TailwindToggle,
    TailwindDivider,
    TailwindSelect,
    TailwindAutocomplete,
    TailwindRadioGroup,
    TailwindSlider,
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

  readonly localeOptions: TailwindOption<string>[] = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' }
  ];

  readonly themeModeOptions: TailwindOption<string>[] = [
    { value: 'light', label: this.transloco.translate('SETTINGS.THEME_LIGHT') },
    { value: 'dark', label: this.transloco.translate('SETTINGS.THEME_DARK') },
    { value: 'system', label: this.transloco.translate('SETTINGS.THEME_SYSTEM') }
  ];

  readonly theme = model<string | null>('comfortable');
  readonly locale = model<string | null>(null);
  readonly themeMode = model<string>('light');
  readonly fontScaleControl = new FormControl(16, { nonNullable: true });
  readonly tabIndex = model(0);
}
