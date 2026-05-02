import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindMenu } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMenu> = {
  title: 'Components/Menu',
  component: TailwindMenu,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '320px' } } },
};
export default meta;
type Story = StoryObj<TailwindMenu>;

export const Default: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Profile', value: 'profile' },
        { label: 'Settings', value: 'settings' },
        { label: 'Help', value: 'help' },
        { divider: true },
        { label: 'Sign out', value: 'signout' },
      ],
    },
    template: `
      <div style="padding:20px">
        <tailwind-menu [items]="items">
          <tailwind-menu-trigger>
            <tailwind-button>Open Menu â–¾</tailwind-button>
          </tailwind-menu-trigger>
        </tailwind-menu>
      </div>`,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Edit', value: 'edit' },
        { label: 'Duplicate', value: 'duplicate', disabled: true },
        { label: 'Archive', value: 'archive' },
        { divider: true },
        { label: 'Delete', value: 'delete' },
      ],
    },
    template: `
      <div style="padding:20px">
        <tailwind-menu [items]="items">
          <tailwind-menu-trigger>
            <tailwind-button variant="outline">Actions â–¾</tailwind-button>
          </tailwind-menu-trigger>
        </tailwind-menu>
      </div>`,
  }),
};

export const AlignRight: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'View', value: 'view' },
        { label: 'Download', value: 'download' },
        { divider: true },
        { label: 'Delete', value: 'delete' },
      ],
    },
    template: `
      <div style="padding:20px; display:flex; justify-content:flex-end">
        <tailwind-menu [items]="items" align="right">
          <tailwind-menu-trigger>
            <tailwind-button variant="ghost">â‹®</tailwind-button>
          </tailwind-menu-trigger>
        </tailwind-menu>
      </div>`,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:20px">
        <tailwind-menu [items]="items" ${argsToTemplate(args)}>
          <tailwind-menu-trigger>
            <tailwind-button>Open Menu â–¾</tailwind-button>
          </tailwind-menu-trigger>
        </tailwind-menu>
      </div>`,
  }),
  args: {
    items: [],
    align: 'left'
  }
};
