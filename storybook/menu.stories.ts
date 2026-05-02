import type { Meta, StoryObj } from '@storybook/angular';
import { AtcMenu } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcMenu> = {
  title: 'Components/Menu',
  component: AtcMenu,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcMenu>;

export const Default: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Profile', icon: 'ðŸ‘¤' },
        { label: 'Settings', icon: 'âš™ï¸' },
        { label: 'Help', icon: 'â“' },
        { type: 'divider' },
        { label: 'Sign out', icon: 'ðŸšª', danger: true },
      ],
    },
    template: `
      <div style="padding:20px">
        <atc-menu [items]="items">
          <atc-button>Open Menu â–¾</atc-button>
        </atc-menu>
      </div>`,
  }),
};

export const WithDisabled: Story = {
  render: () => ({
    props: {
      items: [
        { label: 'Edit', icon: 'âœï¸' },
        { label: 'Duplicate', icon: 'ðŸ“‹', disabled: true },
        { label: 'Archive', icon: 'ðŸ“¦' },
        { type: 'divider' },
        { label: 'Delete', icon: 'ðŸ—‘ï¸', danger: true },
      ],
    },
    template: `
      <div style="padding:20px">
        <atc-menu [items]="items">
          <atc-button variant="outline">Actions â–¾</atc-button>
        </atc-menu>
      </div>`,
  }),
};
