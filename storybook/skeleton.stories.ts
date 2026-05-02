import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSkeleton } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSkeleton> = {
  title: 'Components/Skeleton',
  component: TailwindSkeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect', 'rounded'] },
    width: { control: 'text' },
    height: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<TailwindSkeleton>;

export const Text: Story = {
  render: () => ({
    template: `
      <div class="space-y-2 max-w-xs">
        <tailwind-skeleton variant="text" width="100%"></tailwind-skeleton>
        <tailwind-skeleton variant="text" width="80%"></tailwind-skeleton>
        <tailwind-skeleton variant="text" width="60%"></tailwind-skeleton>
      </div>`,
  }),
};

export const CardSkeleton: Story = {
  render: () => ({
    template: `
      <div class="max-w-sm border border-surface-200 rounded-xl p-5 space-y-4">
        <div class="flex items-center gap-3">
          <tailwind-skeleton variant="circle" width="48px"></tailwind-skeleton>
          <div class="flex-1 space-y-2">
            <tailwind-skeleton variant="text" width="60%"></tailwind-skeleton>
            <tailwind-skeleton variant="text" width="40%"></tailwind-skeleton>
          </div>
        </div>
        <tailwind-skeleton variant="rounded" width="100%" height="120px"></tailwind-skeleton>
        <tailwind-skeleton variant="text" width="100%"></tailwind-skeleton>
        <tailwind-skeleton variant="text" width="75%"></tailwind-skeleton>
      </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-xs">
        <tailwind-skeleton variant="text" width="100%"></tailwind-skeleton>
        <tailwind-skeleton variant="circle" width="56px"></tailwind-skeleton>
        <tailwind-skeleton variant="rect" width="100%" height="80px"></tailwind-skeleton>
        <tailwind-skeleton variant="rounded" width="100%" height="80px"></tailwind-skeleton>
      </div>`,
  }),
};
