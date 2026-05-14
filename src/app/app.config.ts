import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_DATETIME_LANGUAGE } from 'angular-tailwind-components';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { options } from './core/transloco/transloco.options';

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
    { provide: TAILWIND_COMPONENTS_SIZE, useValue: 'md' },
    { provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'it' }
  ]
};
