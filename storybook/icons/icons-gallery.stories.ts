import type { Meta, StoryObj } from '@storybook/angular';
import { StorybookIconsGalleryComponent } from './icons-gallery.component';

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
  parameters: { controls: { disable: true } },
  render: () => ({
    moduleMetadata: {
      imports: [StorybookIconsGalleryComponent]
    },
    template: `<storybook-icons-gallery />`
  })
};
