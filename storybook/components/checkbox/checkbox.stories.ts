import type { Meta, StoryObj } from '@storybook/angular';
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
