import { DatePipe } from '@angular/common';
import { Component, computed, inject, model, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAutocompleteModule,
  TailwindButtonModule,
  TailwindCalendarPanelModule,
  TailwindCardModule,
  TailwindDividerModule,
  TailwindNumberInputModule,
  TailwindPopconfirmModule,
  TailwindRadioGroupModule,
  TailwindRatingModule,
  TailwindSelectModule,
  TailwindSliderModule,
  TailwindTabGroupModule,
  TailwindTitleModule,
  TailwindToastService,
  TailwindToggleModule,
  type TailwindOption
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

/** Valori predefiniti, riusati dal ripristino delle impostazioni. */
const DEFAULTS = {
  density: 'comfortable',
  themeMode: 'light',
  fontScale: 16,
  maxNotifications: 5
} as const;

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindTitleModule,
    TailwindCardModule,
    TailwindTabGroupModule,
    TailwindToggleModule,
    TailwindDividerModule,
    TailwindSelectModule,
    TailwindAutocompleteModule,
    TailwindRadioGroupModule,
    TailwindSliderModule,
    TailwindNumberInputModule,
    TailwindCalendarPanelModule,
    TailwindRatingModule,
    TailwindPopconfirmModule,
    TailwindButtonModule,
    TranslocoPipe,
    DatePipe
  ],
  selector: 'app-page-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(TailwindToastService);

  readonly breadcrumb = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' },
    { label: this.transloco.translate('SETTINGS.PAGE_TITLE'), link: '/settings' }
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

  readonly theme = model<string | null>(DEFAULTS.density);
  readonly locale = model<string | null>(null);
  readonly themeMode = model<string>(DEFAULTS.themeMode);
  readonly fontScaleControl = new FormControl(DEFAULTS.fontScale, { nonNullable: true });
  readonly tabIndex = model(0);

  /** Tab "Notifiche": tetto giornaliero, inizio del periodo silenzioso e feedback. */
  readonly maxNotifications = signal<number | null>(DEFAULTS.maxNotifications);
  readonly quietStart = signal<Date | null>(null);
  readonly feedback = signal(0);

  readonly feedbackMessage = computed(() =>
    this.feedback() > 0
      ? this.transloco.translate('SETTINGS.FEEDBACK_VALUE', { value: this.feedback() })
      : this.transloco.translate('SETTINGS.FEEDBACK_NONE')
  );

  resetSettings(): void {
    this.theme.set(DEFAULTS.density);
    this.locale.set(null);
    this.themeMode.set(DEFAULTS.themeMode);
    this.fontScaleControl.setValue(DEFAULTS.fontScale);
    this.maxNotifications.set(DEFAULTS.maxNotifications);
    this.quietStart.set(null);
    this.feedback.set(0);

    this.toastService.success(
      this.transloco.translate('SETTINGS.TOAST_RESET_TITLE'),
      this.transloco.translate('SETTINGS.TOAST_RESET_BODY'),
      'arrow-path'
    );
  }
}
