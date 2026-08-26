import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindButton } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindButton> = {
  title: 'Display/Button',
  component: TailwindButton,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'transparent']
    },
    kind: {
      control: 'select',
      options: ['solid', 'soft', 'flat', 'outlined', 'ghost', 'text']
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
  parameters: { controls: { exclude: ['icon', 'iconPosition'] } },
  render: args => ({
    props: args,
    template: `
      <div class="w-full">
        <tailwind-button ${argsToTemplate(args)}>Button</tailwind-button>
      </div>`
  }),
  args: { type: 'button', role: 'button', color: 'primary', kind: 'solid', size: 'md', disabled: false }
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
  parameters: { controls: { exclude: ['iconPosition'] } },
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

export const Loading: StoryObj<TailwindButton> = {
  parameters: { controls: { exclude: ['icon', 'iconPosition'] } },
  render: args => ({
    props: args,
    template: `
      <div class="w-full">
        <tailwind-button ${argsToTemplate(args)}>Saving…</tailwind-button>
      </div>`
  }),
  args: { ...Button.args, role: 'button', loading: true }
};

export const FullWidth: StoryObj<TailwindButton> = {
  parameters: { controls: { exclude: ['icon', 'iconPosition'] } },
  render: args => ({
    props: args,
    template: `
      <div class="w-full max-w-sm">
        <tailwind-button ${argsToTemplate(args)}>Continue</tailwind-button>
      </div>`
  }),
  args: { ...Button.args, role: 'button', fullWidth: true }
};

export const Kinds: StoryObj<TailwindButton> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <tailwind-button kind="solid">Solid</tailwind-button>
        <tailwind-button kind="soft">Soft</tailwind-button>
        <tailwind-button kind="outlined">Outlined</tailwind-button>
        <tailwind-button kind="ghost">Ghost</tailwind-button>
        <tailwind-button kind="flat">Flat</tailwind-button>
        <tailwind-button kind="text">Text</tailwind-button>
      </div>`
  })
};

export const Soft: StoryObj<TailwindButton> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <tailwind-button kind="soft" color="primary">Primary</tailwind-button>
        <tailwind-button kind="soft" color="secondary">Secondary</tailwind-button>
        <tailwind-button kind="soft" color="success">Success</tailwind-button>
        <tailwind-button kind="soft" color="warning">Warning</tailwind-button>
        <tailwind-button kind="soft" color="danger">Danger</tailwind-button>
        <tailwind-button kind="soft" color="info">Info</tailwind-button>
      </div>`
  })
};

/** Buttons and fields of the same `size` share a fixed height, so they line up on one row. */
export const AlignedWithFields: StoryObj<TailwindButton> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex items-end gap-2">
          <tailwind-input size="sm" label="Small (h-8)" placeholder="Search…" />
          <tailwind-button size="sm">Search</tailwind-button>
          <tailwind-button size="sm" icon="plus" ariaLabel="Add"></tailwind-button>
        </div>
        <div class="flex items-end gap-2">
          <tailwind-input size="md" label="Medium (h-9)" placeholder="Search…" />
          <tailwind-button size="md">Search</tailwind-button>
          <tailwind-button size="md" icon="plus" ariaLabel="Add"></tailwind-button>
        </div>
        <div class="flex items-end gap-2">
          <tailwind-input size="lg" label="Large (h-11)" placeholder="Search…" />
          <tailwind-button size="lg">Search</tailwind-button>
          <tailwind-button size="lg" icon="plus" ariaLabel="Add"></tailwind-button>
        </div>
      </div>`
  })
};
