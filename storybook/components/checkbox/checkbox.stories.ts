import type { Meta, StoryObj } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindCheckbox } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCheckbox> = {
  title: 'Forms/Checkbox',
  component: TailwindCheckbox,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: { control: 'select', options: [...TAILWIND_PALETTES] },
    checked: { control: 'boolean' }
  }
};
export default meta;

export const Checkbox: StoryObj<TailwindCheckbox> = {
  render: args => ({
    props: args,
    template: `<tailwind-checkbox [label]="label" [size]="size" [color]="color" [(checked)]="checked"></tailwind-checkbox>`
  }),
  args: { label: 'Accept terms and conditions', size: 'md', color: 'neutral', checked: false }
};

export const PaletteGallery: StoryObj<TailwindCheckbox> = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        @for (palette of palettes; track palette) {
          <tailwind-checkbox [label]="palette" [color]="palette" [checked]="true" />
        }
      </div>
    `,
    props: { palettes: [...TAILWIND_PALETTES] }
  })
};
