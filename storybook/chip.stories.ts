import type { Meta, StoryObj } from '@storybook/angular';
import { AtcChip } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcChip> = {
  title: 'Components/Chip',
  component: AtcChip,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcChip>;

export const Default: Story = {
  render: () => ({
    template: `<atc-chip>Angular</atc-chip>`,
  }),
};

export const Removable: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <atc-chip [removable]="true">Angular</atc-chip>
        <atc-chip [removable]="true" variant="success">TypeScript</atc-chip>
        <atc-chip [removable]="true" variant="info">Tailwind</atc-chip>
        <atc-chip [removable]="true" variant="warning">Design</atc-chip>
      </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <atc-chip variant="default">Default</atc-chip>
        <atc-chip variant="primary">Primary</atc-chip>
        <atc-chip variant="success">Success</atc-chip>
        <atc-chip variant="warning">Warning</atc-chip>
        <atc-chip variant="danger">Danger</atc-chip>
        <atc-chip variant="info">Info</atc-chip>
      </div>`,
  }),
};
