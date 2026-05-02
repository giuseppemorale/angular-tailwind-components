import type { Meta, StoryObj } from '@storybook/angular';
import { AtcBadge } from 'angular-tailwind-components';

const meta: Meta<AtcBadge> = {
  title: 'Components/Badge',
  component: AtcBadge,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcBadge>;

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2 items-center">
        <atc-badge variant="primary">Primary</atc-badge>
        <atc-badge variant="neutral">Neutral</atc-badge>
        <atc-badge variant="success">Success</atc-badge>
        <atc-badge variant="warning">Warning</atc-badge>
        <atc-badge variant="danger">Danger</atc-badge>
        <atc-badge variant="info">Info</atc-badge>
      </div>
    `,
  }),
};

export const WithDot: Story = {
  render: () => ({
    template: `<atc-badge variant="success" [dot]="true">Active</atc-badge>`,
  }),
};

export const Pill: Story = {
  render: () => ({
    template: `<atc-badge variant="primary" [pill]="true">99+</atc-badge>`,
  }),
};
