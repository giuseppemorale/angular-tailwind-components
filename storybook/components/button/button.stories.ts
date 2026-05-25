import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindButton } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindButton> = {
  title: 'Components/Button',
  component: TailwindButton,
  argTypes: {
    color: { control: 'select', options: [...TAILWIND_PALETTES] },
    kind: {
      control: 'select',
      options: ['solid', 'flat', 'outlined', 'ghost', 'text']
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    role: { control: 'select', options: ['button', 'menuitem', 'tab', 'switch', 'checkbox', 'radio'] },
    icon: { control: 'text' },
    iconPosition: { control: 'select', options: ['left', 'right'] }
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
  args: { type: 'button', role: 'button', color: 'blue', kind: 'solid', size: 'md', disabled: false }
};

export const WithIcon: StoryObj<TailwindButton> = {
  render: args => ({
    props: args,
    template: `
      <div class="w-full">
        <tailwind-button ${argsToTemplate(args)}>Add item</tailwind-button>
      </div>`
  }),
  args: { ...Button.args, role: 'button', icon: 'plus', iconPosition: 'left' }
};

export const IconOnly: StoryObj<TailwindButton> = {
  render: args => ({
    props: args,
    template: `
      <div class="w-full">
        <tailwind-button ${argsToTemplate(args)} aria-label="Add"></tailwind-button>
      </div>`
  }),
  args: { ...Button.args, role: 'button', icon: 'plus' }
};

export const IconRight: StoryObj<TailwindButton> = {
  render: WithIcon.render,
  args: { ...WithIcon.args, role: 'button', iconPosition: 'right' }
};
