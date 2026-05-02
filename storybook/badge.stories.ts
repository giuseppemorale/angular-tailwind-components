import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindBadge } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBadge> = {
  title: 'Components/Badge',
  component: TailwindBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    dot: { control: 'boolean' },
    pill: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TailwindBadge>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-badge [variant]="variant" [size]="size" [dot]="dot" [pill]="pill">Badge</tailwind-badge>`,
  }),
  args: { variant: 'primary', size: 'md', dot: false, pill: false },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-badge variant="primary">Primary</tailwind-badge>
        <tailwind-badge variant="neutral">Neutral</tailwind-badge>
        <tailwind-badge variant="success">Success</tailwind-badge>
        <tailwind-badge variant="warning">Warning</tailwind-badge>
        <tailwind-badge variant="danger">Danger</tailwind-badge>
        <tailwind-badge variant="info">Info</tailwind-badge>
      </div>`,
  }),
};

export const WithDot: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <tailwind-badge variant="success" [dot]="true">Online</tailwind-badge>
        <tailwind-badge variant="danger" [dot]="true">Offline</tailwind-badge>
        <tailwind-badge variant="warning" [dot]="true">Away</tailwind-badge>
      </div>`,
  }),
};

export const Pill: Story = {
  render: () => ({
    template: `
      <div class="flex gap-2">
        <tailwind-badge variant="primary" [pill]="true">New</tailwind-badge>
        <tailwind-badge variant="success" [pill]="true">Active</tailwind-badge>
        <tailwind-badge variant="danger" [pill]="true">99+</tailwind-badge>
      </div>`,
  }),
};
