import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TAILWIND_HERO_ICON_NAMES } from '../../projects/angular-tailwind-components/src/lib/models/icons';
import { TailwindIcon } from '../../projects/angular-tailwind-components/src/public-api';

@Component({
  imports: [TailwindIcon],
  selector: 'storybook-icons-gallery',
  template: `
    <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4 text-neutral-800 dark:text-neutral-100">
      @for (name of icons; track name) {
        <div
          class="flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <tailwind-icon class="shrink-0" [icon]="name" [size]="'normal'" />
          <code
            class="line-clamp-3 min-h-0 w-full select-all break-all text-center font-mono text-[12px] leading-snug text-neutral-600 dark:text-neutral-400">
            {{ name }}
          </code>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorybookIconsGalleryComponent {
  readonly icons = TAILWIND_HERO_ICON_NAMES;
}

const meta: Meta<StorybookIconsGalleryComponent> = {
  title: 'Docs/Icons',
  component: StorybookIconsGalleryComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Catalogo delle icone Heroicons incluse nella libreria: usa il tipo **`TailwindHeroIcon`** e la costante **`TAILWIND_HERO_ICON_NAMES`** da `angular-tailwind-components`.'
      },
      story: { inline: false }
    }
  }
};

export default meta;

export const Gallery: StoryObj<StorybookIconsGalleryComponent> = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookIconsGalleryComponent]
    },
    template: `<storybook-icons-gallery />`
  })
};
