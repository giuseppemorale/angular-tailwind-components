import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindChip } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindChip> = {
  title: 'Components/Chip',
  component: TailwindChip,
  tags: ['autodocs']
};
export default meta;

export const Chip: StoryObj<TailwindChip> = {
  render: args => ({
    props: args,
    template: `<tailwind-chip>Angular</tailwind-chip>`,
    args: {
      variant: 'neutral',
      size: 'md',
      removable: false
    }
  })
};

export const Removable: StoryObj<TailwindChip> = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-chip [removable]="true">Angular</tailwind-chip>
        <tailwind-chip [removable]="true" variant="success">TypeScript</tailwind-chip>
        <tailwind-chip [removable]="true" variant="info">Tailwind</tailwind-chip>
        <tailwind-chip [removable]="true" variant="warning">Design</tailwind-chip>
      </div>`
  })
};

export const AllVariants: StoryObj<TailwindChip> = {
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-chip variant="default">Default</tailwind-chip>
        <tailwind-chip variant="primary">Primary</tailwind-chip>
        <tailwind-chip variant="success">Success</tailwind-chip>
        <tailwind-chip variant="warning">Warning</tailwind-chip>
        <tailwind-chip variant="danger">Danger</tailwind-chip>
        <tailwind-chip variant="info">Info</tailwind-chip>
      </div>`
  })
};
