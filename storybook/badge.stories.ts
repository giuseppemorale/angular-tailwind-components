import type { Meta, StoryObj } from '@storybook/angular';
import { AtcBadge } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcBadge> = {
  title: 'Components/Badge',
  component: AtcBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    dot: { control: 'boolean' },
    pill: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AtcBadge>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-badge [variant]="variant" [size]="size" [dot]="dot" [pill]="pill">Badge</atc-badge>`,
  }),
  args: { variant: 'primary', size: 'md', dot: false, pill: false },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <atc-badge variant="primary">Primary</atc-badge>
        <atc-badge variant="neutral">Neutral</atc-badge>
        <atc-badge variant="success">Success</atc-badge>
        <atc-badge variant="warning">Warning</atc-badge>
        <atc-badge variant="danger">Danger</atc-badge>
        <atc-badge variant="info">Info</atc-badge>
      </div>`,
  }),
};

export const WithDot: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <atc-badge variant="success" [dot]="true">Online</atc-badge>
        <atc-badge variant="danger" [dot]="true">Offline</atc-badge>
        <atc-badge variant="warning" [dot]="true">Away</atc-badge>
      </div>`,
  }),
};

export const Pill: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <atc-badge variant="primary" [pill]="true">New</atc-badge>
        <atc-badge variant="success" [pill]="true">Active</atc-badge>
        <atc-badge variant="danger" [pill]="true">99+</atc-badge>
      </div>`,
  }),
};
