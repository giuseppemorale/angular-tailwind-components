import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideTailwindComponents } from 'angular-tailwind-components';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { options } from './core/transloco/transloco.options';
import { TAILWIND_OPTIONS } from './core/tailwind-options/tailwind-options';

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
    provideTailwindComponents(TAILWIND_OPTIONS)
  ]
};
