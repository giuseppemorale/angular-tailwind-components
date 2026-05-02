import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindChip } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindChip> = {
  title: 'Components/Chip',
  component: TailwindChip,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindChip>;

export const Default: Story = {
  render: () => ({
    template: `<tailwind-chip>Angular</tailwind-chip>`,
  }),
};

export const Removable: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-chip [removable]="true">Angular</tailwind-chip>
        <tailwind-chip [removable]="true" variant="success">TypeScript</tailwind-chip>
        <tailwind-chip [removable]="true" variant="info">Tailwind</tailwind-chip>
        <tailwind-chip [removable]="true" variant="warning">Design</tailwind-chip>
      </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-chip variant="default">Default</tailwind-chip>
        <tailwind-chip variant="primary">Primary</tailwind-chip>
        <tailwind-chip variant="success">Success</tailwind-chip>
        <tailwind-chip variant="warning">Warning</tailwind-chip>
        <tailwind-chip variant="danger">Danger</tailwind-chip>
        <tailwind-chip variant="info">Info</tailwind-chip>
      </div>`,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-chip ${argsToTemplate(args)}>Angular</tailwind-chip>`,
  }),
  args: {
    variant: 'neutral',
    size: 'md',
    removable: false
  }
};
