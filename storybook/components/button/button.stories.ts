import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindButton } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindButton> = {
  title: 'Components/Button',
  component: TailwindButton,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info']
    },
    kind: {
      control: 'select',
      options: ['solid', 'outlined', 'text']
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] }
  }
};
export default meta;

export const Button: StoryObj<TailwindButton> = {
  render: args => ({
    props: args,
    template: `
      <div class="w-full">
        <tailwind-button ${argsToTemplate(args)}>Button</tailwind-button>
      </div>`
  }),
  args: { type: 'button', color: 'primary', kind: 'solid', size: 'md', disabled: false }
};
