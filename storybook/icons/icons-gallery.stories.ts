import type { Meta, StoryObj } from '@storybook/angular';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TAILWIND_HEROICON_NAMES } from '../../projects/angular-tailwind-components/src/lib/models/icons';
import { TailwindIcon } from '../../projects/angular-tailwind-components/src/public-api';

@Component({
  imports: [TailwindIcon],
  selector: 'storybook-icons-gallery',
  template: `
    <div class="mb-6 flex flex-col gap-2 text-neutral-800 dark:text-neutral-100">
      <label class="text-sm font-medium text-neutral-700 dark:text-neutral-300" for="icons-search">
        Cerca icona
      </label>
      <input
        id="icons-search"
        type="search"
        class="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-600 dark:bg-neutral-900"
        placeholder="es. bell, arrow, cog…"
        [value]="query()"
        (input)="onSearchInput($event)" />
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ filteredIcons().length }} / {{ iconCount }} icone
      </p>
    </div>

    @if (filteredIcons().length === 0) {
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        Nessuna icona corrisponde a «{{ query().trim() }}».
      </p>
    } @else {
      <div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4 text-neutral-800 dark:text-neutral-100">
        @for (name of filteredIcons(); track name) {
          <div
            class="flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <tailwind-icon class="shrink-0" [icon]="name" [size]="24" />
            <code
              class="line-clamp-3 min-h-0 w-full select-all break-all text-center font-mono text-[12px] leading-snug text-neutral-600 dark:text-neutral-400">
              {{ name }}
            </code>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StorybookIconsGalleryComponent {
  readonly iconCount = TAILWIND_HEROICON_NAMES.length;
  readonly query = signal('');
  readonly filteredIcons = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return TAILWIND_HEROICON_NAMES;
    }
    return TAILWIND_HEROICON_NAMES.filter(name => name.toLowerCase().includes(q));
  });

  onSearchInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}

const meta: Meta<StorybookIconsGalleryComponent> = {
  title: 'Docs/Icons',
  component: StorybookIconsGalleryComponent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Catalogo delle icone Heroicons outline incluse nella libreria: usa il tipo **`TailwindHeroicon`** e la costante **`TAILWIND_HEROICON_NAMES`** da `angular-tailwind-components`.'
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
