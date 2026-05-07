import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindCheckbox } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCheckbox> = {
  title: 'Forms/Checkbox',
  component: TailwindCheckbox,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    checked: { control: 'boolean' }
  }
};
export default meta;

export const Checkbox: StoryObj<TailwindCheckbox> = {
  render: args => ({
    props: args,
    template: `<tailwind-checkbox [label]="label" [size]="size" [checked]="checked"></tailwind-checkbox>`
  }),
  args: { label: 'Accept terms and conditions', size: 'md', checked: false }
};

export const States: StoryObj<TailwindCheckbox> = {
  render: args => ({
    props: args,
    template: `
      <div class="space-y-3">
        <tailwind-checkbox ${argsToTemplate(args)} label="Unchecked" />
        <tailwind-checkbox label="Checked" [checked]="true" />
        <tailwind-checkbox label="Small" size="sm" />
        <tailwind-checkbox label="Large" size="lg" />
      </div>`
  })
};

export const CheckboxGroup: StoryObj<TailwindCheckbox> = {
  render: args => ({
    props: args,
    template: `
      <div class="space-y-2">
        <p class="text-sm font-medium text-surface-700 mb-3">Select your interests:</p>
        <tailwind-checkbox ${argsToTemplate(args)} label="Angular" />
        <tailwind-checkbox label="TypeScript" />
        <tailwind-checkbox label="Tailwind CSS" />
        <tailwind-checkbox label="Storybook" />
      </div>`
  })
};
