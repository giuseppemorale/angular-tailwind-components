import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { type TailwindMenuItem, TailwindToolbar } from '../../../projects/angular-tailwind-components/src/public-api';

const horizontalMenu: TailwindMenuItem[] = [
  { label: 'Home', value: 'home' },
  {
    label: 'Products',
    value: 'products',
    items: [
      { label: 'Catalog', value: 'catalog' },
      { label: 'Pricing', value: 'pricing' }
    ]
  },
  { label: 'Docs', value: 'docs' }
];

const verticalMenu: TailwindMenuItem[] = [
  { label: 'Dashboard', value: 'dashboard' },
  {
    label: 'Workspace',
    value: 'workspace',
    items: [
      { label: 'Projects', value: 'projects' },
      { label: 'Teams', value: 'teams' }
    ]
  },
  { label: 'Settings', value: 'settings' },
  { divider: true },
  { label: 'Profile', value: 'profile' }
];

const iconOnlyMenu: TailwindMenuItem[] = [
  { icon: 'home', value: 'home', tooltip: 'Home' },
  { icon: 'document-text', value: 'docs', tooltip: 'Documentazione' },
  { divider: true },
  { icon: 'bell', value: 'notifications', tooltip: 'Notifiche' },
  { icon: 'cog-6-tooth', value: 'settings', tooltip: 'Impostazioni' }
];

const meta: Meta<TailwindToolbar> = {
  title: 'Components/Toolbar',
  component: TailwindToolbar,
  parameters: {
    docs: {
      description: {
        component:
          'App bar or side rail: **`[tailwind-toolbar-logo]`** and **`[tailwind-toolbar-end]`** via content projection (use attributes on native elements, e.g. `<div tailwind-toolbar-logo>`); central items come from the **`menu`** input (`TailwindMenuItem[]`), laid out as a row when **horizontal** and a column when **vertical** (dividers: vertical rule vs `<hr>`). Entries with **`items`** open a nested **`tailwind-menu`** on click (below in horizontal mode, to the right in vertical). Listen to **`onMenuSelect`** for leaf clicks only. **width="container"** applies only when **horizontal** (responsive width). **Vertical** toolbar is always **`h-full`** in its column (`w-full`).'
      },
      story: { height: '420px' }
    }
  },
  argTypes: {
    rounded: { control: 'boolean' },
    width: { control: 'select', options: ['full', 'container'] },
    elevated: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    color: { control: 'select', options: ['default', 'info', 'success', 'warning', 'danger'] }
  },
  args: {
    rounded: true,
    width: 'full',
    elevated: false,
    orientation: 'horizontal',
    color: 'default'
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
            <tailwind-button kind="flat" color="${args.color}">Register</tailwind-button>
          </div>
        </tailwind-toolbar>
        @if (lastSelection) {
          <p class="text-xs text-neutral-500">Selected: {{ lastSelection }}</p>
        }
      </div>
    `
  })
};

export const ContainerWidth: StoryObj<TailwindToolbar> = {
  args: { width: 'container', elevated: true },
  render: Horizontal.render
};

/** Rail verticale con voci solo icona (`label` vuoto / assente, `aria-label` da `value`, tooltip da `tooltip`). */
export const VerticalIconMenu: StoryObj<TailwindToolbar> = {
  parameters: {
    controls: { exclude: ['width'] },
    docs: {
      story: { height: '520px' },
      description: {
        story:
          'Voci solo icona: **`label`** assente o stringa vuota; **`aria-label`** da **`value`**; **`tooltip`** per etichetta al passaggio del mouse (default posizione **`right`**). Layout come sidebar verticale.'
      }
    }
  },
  args: {
    orientation: 'vertical',
    elevated: true,
    rounded: true,
    width: 'full'
  },
  render: args => ({
    props: { ...args, menu: iconOnlyMenu, lastSelection: '' as string },
    template: `
      <div class="flex h-[90vh] gap-4 border border-dashed border-neutral-200 rounded-lg p-2">
        <tailwind-toolbar class="w-20 shrink-0" ${argsToTemplate(args)} [menu]="menu" (onMenuSelect)="lastSelection = $event.label ?? $event.value ?? ''">
          <div tailwind-toolbar-logo class="flex justify-center px-2">
            <img src="/logo.png" alt="Logo" class="h-8 w-8">
          </div>
          <div tailwind-toolbar-end>
            <tailwind-button color="secondary" kind="text" ariaLabel="Logout">
              <tailwind-icon icon="arrow-right-end-on-rectangle" [size]="22" />
            </tailwind-button>
          </div>
        </tailwind-toolbar>
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          @if (lastSelection) {
            <p class="text-xs text-neutral-500">Selected: {{ lastSelection }}</p>
          }
          <div class="flex-1 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">Main content</div>
        </div>
      </div>
    `
  })
};

export const VerticalSidebar: StoryObj<TailwindToolbar> = {
  parameters: {
    controls: { exclude: ['width'] },
    docs: { story: { height: '520px' } }
  },
  args: {
    orientation: 'vertical',
    elevated: true,
    rounded: true,
    width: 'full'
  },
  render: args => ({
    props: { ...args, menu: verticalMenu },
    template: `
      <div class="flex h-[90vh] gap-4 border border-dashed border-neutral-200 rounded-lg p-2">
        <tailwind-toolbar class="w-48 shrink-0" ${argsToTemplate(args)} [menu]="menu">
          <div tailwind-toolbar-logo class="text-base font-bold text-neutral-800 px-2">
            <img src="/logo.png" alt="Logo" class="h-8 w-8">
          </div>
          <div tailwind-toolbar-end class="px-2">
            <tailwind-button color="secondary" kind="text">Logout</tailwind-button>
          </div>
        </tailwind-toolbar>
        <div class="flex-1 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-600">Main content</div>
      </div>
    `
  })
};
