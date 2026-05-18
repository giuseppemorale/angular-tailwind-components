import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { defineTheme } from 'angular-tailwind-components';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { options } from './core/transloco/transloco.options';
import { TAILWIND_CONFIG } from './core/tailwind-config/tailwind-config';

const inizializeApp = () => {
  const translocoService = inject(TranslocoService);
  translocoService.setActiveLang('it');

  return translocoService.load('it');
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideTransloco(options),
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(inizializeApp),
    defineTheme(TAILWIND_CONFIG)
  ]
};
