import { TailwindComponentsConfig } from 'angular-tailwind-components';

export const TAILWIND_CONFIG: TailwindComponentsConfig = {
  COMPONENTS_SIZE: 'md',
  DATETIME_LANGUAGE: 'it',
  BUTTON_KIND: 'flat',
  PAGINATION_SUMMARY: 'Elementi da {start} a {end} di {total}',
  PASSWORD_LABELS: {
    prompt: 'Scegli una password',
    weak: 'Debole',
    medium: 'Buona',
    strong: 'Forte'
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
  }
};
