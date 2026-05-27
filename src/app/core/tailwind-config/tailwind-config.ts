import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { TailwindComponentsConfig } from 'angular-tailwind-components';

export const TAILWIND_CONFIG = (): TailwindComponentsConfig => {
  const transloco = inject(TranslocoService);

  return {
    COMPONENTS_SIZE: 'md',
    DATETIME_LANGUAGE: 'it',
    BUTTON_KIND: 'flat',
    PAGINATION_SUMMARY: transloco.translate('TAILWIND_CONFIG.PAGINATION_SUMMARY'),
    PASSWORD_LABELS: {
      prompt: transloco.translate('TAILWIND_CONFIG.PASSWORD_LABELS.PROMPT'),
      weak: transloco.translate('TAILWIND_CONFIG.PASSWORD_LABELS.WEAK'),
      medium: transloco.translate('TAILWIND_CONFIG.PASSWORD_LABELS.MEDIUM'),
      strong: transloco.translate('TAILWIND_CONFIG.PASSWORD_LABELS.STRONG')
    },
    TITLE_SCALE: {
      h1: {
        classes: 'text-4xl font-bold tracking-tight text-neutral-900',
        iconSize: 64
      },
      h2: {
        classes: 'text-3xl font-bold tracking-tight text-neutral-900',
        iconSize: 48
      },
      h3: {
        classes: 'text-2xl font-semibold tracking-tight text-neutral-900',
        iconSize: 32
      },
      h4: {
        classes: 'text-xl font-normal text-neutral-900',
        iconSize: 24
      },
      h5: {
        classes: 'text-lg font-normal text-neutral-900',
        iconSize: 20
      },
      h6: {
        classes: 'text-base font-normal text-neutral-800 uppercase tracking-wide',
        iconSize: 14
      }
    },
    EDITOR_LABELS: {
      linkModalTitle: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.LINK_MODAL_TITLE'),
      imageModalTitle: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_MODAL_TITLE'),
      imageUrlLabel: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_URL_LABEL'),
      imageUrlPlaceholder: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_URL_PLACEHOLDER'),
      imageAltLabel: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_ALT_LABEL'),
      imageAltPlaceholder: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_ALT_PLACEHOLDER'),
      linkUrlLabel: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.LINK_URL_LABEL'),
      linkUrlPlaceholder: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.LINK_URL_PLACEHOLDER'),
      linkTextLabel: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.LINK_TEXT_LABEL'),
      linkTextPlaceholder: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.LINK_TEXT_PLACEHOLDER'),
      htmlSourcePlaceholder: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.HTML_SOURCE_PLACEHOLDER'),
      imageMaxSizeError: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.IMAGE_MAX_SIZE_ERROR'),
      cancel: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.CANCEL'),
      insert: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.INSERT'),
      codeView: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.CODE_VIEW'),
      codeViewExit: transloco.translate('TAILWIND_CONFIG.EDITOR_LABELS.CODE_VIEW_EXIT')
    }
  };
};
