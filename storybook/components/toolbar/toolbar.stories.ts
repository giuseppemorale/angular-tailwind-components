import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindToolbar } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindToolbar> = {
  title: 'Components/Toolbar',
  component: TailwindToolbar,
  parameters: {
    docs: {
      description: {
        component:
          'App bar or side rail with three projection slots: `tailwind-toolbar-logo`, `tailwind-toolbar-content`, and `tailwind-toolbar-end`. **width="container"**: horizontal → responsive width (95% / 85% / 75%, `mx-auto`); vertical → same breakpoints on **height** (`my-auto` vertically). **width="full"**: horizontal → `w-full`; vertical → `h-full` in the column.'
      },
      story: { height: '420px' }
    }
  },
  argTypes: {
    rounded: { control: 'boolean' },
    width: { control: 'select', options: ['full', 'container'] },
    elevated: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] }
  },
  args: {
    rounded: true,
    width: 'full',
    elevated: false,
    orientation: 'horizontal'
  }
};
export default meta;

type Story = StoryObj<TailwindToolbar>;

export const Horizontal: Story = {
  render: args => ({
    props: args,
    template: `
      <tailwind-toolbar ${argsToTemplate(args)}>
        <tailwind-toolbar-logo class="text-lg font-semibold text-primary-600">Logo</tailwind-toolbar-logo>
        <tailwind-toolbar-content class="flex flex-wrap gap-2 text-sm text-surface-600">
          <a href="#" class="hover:text-surface-900">Home</a>
          <a href="#" class="hover:text-surface-900">Docs</a>
        </tailwind-toolbar-content>
        <tailwind-toolbar-end class="flex gap-2">
          <tailwind-button size="sm" color="secondary" kind="outlined">Sign in</tailwind-button>
          <tailwind-button size="sm">Get started</tailwind-button>
        </tailwind-toolbar-end>
      </tailwind-toolbar>
    `
  })
};

export const VerticalSidebar: Story = {
  args: {
    orientation: 'vertical',
    elevated: true,
    rounded: true,
    width: 'full'
  },
  render: args => ({
    props: args,
    template: `
      <div class="flex h-[80vh] gap-4 border border-dashed border-surface-200 rounded-lg p-2">
        <tailwind-toolbar class="w-42" ${argsToTemplate(args)}>
          <tailwind-toolbar-logo class="text-base font-bold text-surface-800 px-2">App</tailwind-toolbar-logo>
          <tailwind-toolbar-content class="flex flex-col gap-1 text-sm ps-4">
            <tailwind-button size="sm" color="secondary" kind="ghost">Dashboard</tailwind-button>
            <tailwind-button size="sm" color="secondary" kind="ghost">Settings</tailwind-button>
          </tailwind-toolbar-content>
          <tailwind-toolbar-end class="px-2">
            <tailwind-button size="sm" color="secondary" kind="text">Logout</tailwind-button>
          </tailwind-toolbar-end>
        </tailwind-toolbar>
        <div class="flex-1 rounded-lg bg-surface-50 p-4 text-sm text-surface-600">Main content</div>
      </div>
    `
  })
};

export const ContainerWidth: Story = {
  args: { width: 'container', elevated: true },
  render: Horizontal.render
};

/** Vertical toolbar with **width="full"** (`h-full` in the column). */
export const VerticalFullHeight: Story = {
  parameters: { docs: { story: { height: '520px' } } },
  args: {
    orientation: 'vertical',
    elevated: true,
    rounded: true,
    width: 'full'
  },
  render: VerticalSidebar.render
};
