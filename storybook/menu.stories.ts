import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindMenu } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMenu> = {
  title: 'Components/Menu',
  component: TailwindMenu,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindMenu>;

export const Default: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Profile', icon: 'Ã°Å¸â€˜Â¤' },
        { label: 'Settings', icon: 'Ã¢Å¡â„¢Ã¯Â¸Â' },
        { label: 'Help', icon: 'Ã¢Ââ€œ' },
        { type: 'divider' },
        { label: 'Sign out', icon: 'Ã°Å¸Å¡Âª', danger: true },
      ],
    },
    template: `
      <div style="padding:20px">
        <tailwind-menu [items]="items">
          <tailwind-button>Open Menu Ã¢â€“Â¾</tailwind-button>
        </tailwind-menu>
      </div>`,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Edit', icon: 'Ã¢Å“ÂÃ¯Â¸Â' },
        { label: 'Duplicate', icon: 'Ã°Å¸â€œâ€¹', disabled: true },
        { label: 'Archive', icon: 'Ã°Å¸â€œÂ¦' },
        { type: 'divider' },
        { label: 'Delete', icon: 'Ã°Å¸â€”â€˜Ã¯Â¸Â', danger: true },
      ],
    },
    template: `
      <div style="padding:20px">
        <tailwind-menu [items]="items">
          <tailwind-button variant="outline">Actions Ã¢â€“Â¾</tailwind-button>
        </tailwind-menu>
      </div>`,
  }),
};
