import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { routes } from './app.routes';
import { options } from './core/transloco/transloco.options';
import { provideTailwindConfig } from 'angular-tailwind-components';
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
    provideAppInitializer(inizializeApp),
    provideTailwindConfig(TAILWIND_CONFIG),
    provideBrowserGlobalErrorListeners()
  ]
};
