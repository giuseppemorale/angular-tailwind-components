import { isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './transloco.loader';

export const options = {
  config: {
    availableLangs: ['it'],
    defaultLang: 'it',
    reRenderOnLangChange: true,
    prodMode: !isDevMode()
  },
  loader: TranslocoHttpLoader
};
