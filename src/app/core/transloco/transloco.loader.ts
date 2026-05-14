import { Injectable } from '@angular/core';
import { TranslocoLoader } from '@jsverse/transloco';
import { from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string) {
    return from(import(`../i18n/${lang.toLowerCase()}.json`)).pipe(map(module => module.default));
  }
}
