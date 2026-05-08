import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_DATETIME_LANGUAGE } from 'angular-tailwind-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    { provide: TAILWIND_COMPONENTS_SIZE, useValue: 'md' },
    { provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'it' }
  ]
};
