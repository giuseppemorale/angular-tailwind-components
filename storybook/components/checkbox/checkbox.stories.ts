import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindCheckbox } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCheckbox> = {
  title: 'Form Controls/Checkbox',
  component: TailwindCheckbox,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    checked: { control: 'boolean' }
  }
};
export default meta;

export const Checkbox: StoryObj<TailwindCheckbox> = {
  parameters: { controls: { exclude: ['description'] } },
  render: args => ({
    props: args,
    template: `<tailwind-checkbox [label]="label" [size]="size" [(checked)]="checked"></tailwind-checkbox>`
  }),
  args: { label: 'Accept terms and conditions', size: 'md', checked: false }
};

export const Indeterminate: StoryObj<TailwindCheckbox> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-checkbox label="Seleziona tutto" [indeterminate]="true" />
        <div class="ml-6 flex flex-col gap-2">
          <tailwind-checkbox label="Riga 1" [checked]="true" />
          <tailwind-checkbox label="Riga 2" />
          <tailwind-checkbox label="Riga 3" />
        </div>
      </div>`
  })
};
