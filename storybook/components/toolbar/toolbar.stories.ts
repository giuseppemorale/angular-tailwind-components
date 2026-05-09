import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { type TailwindMenuItem, TailwindToolbar } from '../../../projects/angular-tailwind-components/src/public-api';

const horizontalMenu: TailwindMenuItem[] = [
  { label: 'Home', value: 'home' },
  { label: 'Docs', value: 'docs' }
];

const verticalMenu: TailwindMenuItem[] = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Settings', value: 'settings' },
  { divider: true },
  { label: 'Profile', value: 'profile' }
];

const meta: Meta<TailwindToolbar> = {
  title: 'Components/Toolbar',
  component: TailwindToolbar,
  parameters: {
    docs: {
      description: {
        component:
          'App bar or side rail: **`[tailwind-toolbar-logo]`** and **`[tailwind-toolbar-end]`** via content projection (use attributes on native elements, e.g. `<div tailwind-toolbar-logo>`); central items come from the **`menu`** input (`TailwindMenuItem[]`), laid out as a row when **horizontal** and a column when **vertical** (dividers: vertical rule vs `<hr>`). Listen to **`onMenuSelect`** for clicks. **width="container"** applies only when **horizontal** (responsive width). **Vertical** toolbar is always **`h-full`** in its column (`w-full`).'
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

export const Horizontal: StoryObj<TailwindToolbar> = {
  render: args => ({
    props: { ...args, menu: horizontalMenu, lastSelection: '' as string },
    template: `
      <div class="space-y-2">
        <tailwind-toolbar ${argsToTemplate(args)} [menu]="menu" (onMenuSelect)="lastSelection = $event.label ?? $event.value ?? ''">
          <div tailwind-toolbar-logo class="text-lg font-semibold text-primary-600">
            <img src="/logo.png" alt="Logo" class="h-8 w-8">
          </div>
          <div tailwind-toolbar-end class="flex gap-2">
            <tailwind-button size="sm" color="secondary" kind="outlined">Sign in</tailwind-button>
            <tailwind-button size="sm">Get started</tailwind-button>
          </div>
        </tailwind-toolbar>
        @if (lastSelection) {
          <p class="text-xs text-surface-500">Selected: {{ lastSelection }}</p>
        }
      </div>
    `
  })
};

export const ContainerWidth: StoryObj<TailwindToolbar> = {
  args: { width: 'container', elevated: true },
  render: Horizontal.render
};

export const VerticalSidebar: StoryObj<TailwindToolbar> = {
  parameters: { docs: { story: { height: '520px' } } },
  args: {
    orientation: 'vertical',
    elevated: true,
    rounded: true,
    width: 'full'
  },
  render: args => ({
    props: { ...args, menu: verticalMenu },
    template: `
      <div class="flex h-[80vh] gap-4 border border-dashed border-surface-200 rounded-lg p-2">
        <tailwind-toolbar class="w-48 shrink-0" ${argsToTemplate(args)} [menu]="menu">
          <div tailwind-toolbar-logo class="text-base font-bold text-surface-800 px-2">App</div>
          <div tailwind-toolbar-end class="px-2">
            <tailwind-button size="sm" color="secondary" kind="text">Logout</tailwind-button>
          </div>
        </tailwind-toolbar>
        <div class="flex-1 rounded-lg bg-surface-50 p-4 text-sm text-surface-600">Main content</div>
      </div>
    `
  })
};
