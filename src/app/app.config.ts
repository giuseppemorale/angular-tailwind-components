import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_DATETIME_LANGUAGE } from 'angular-tailwind-components';
import { TranslocoService } from '@jsverse/transloco';

const inizializeApp = () => {
  const translocoService = inject(TranslocoService);
  translocoService.setActiveLang('it');

  return translocoService.load('it');
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(inizializeApp),
    { provide: TAILWIND_COMPONENTS_SIZE, useValue: 'md' },
    { provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'it' }
  ]
};
