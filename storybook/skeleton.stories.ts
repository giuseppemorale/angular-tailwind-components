import type { Meta, StoryObj } from '@storybook/angular';
import { AtcSkeleton } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcSkeleton> = {
  title: 'Components/Skeleton',
  component: AtcSkeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect', 'rounded'] },
    width: { control: 'text' },
    height: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<AtcSkeleton>;

export const Text: Story = {
  render: () => ({
    template: `
      <div class="space-y-2 max-w-xs">
        <atc-skeleton variant="text" width="100%"></atc-skeleton>
        <atc-skeleton variant="text" width="80%"></atc-skeleton>
        <atc-skeleton variant="text" width="60%"></atc-skeleton>
      </div>`,
  }),
};

export const CardSkeleton: Story = {
  render: () => ({
    template: `
      <div class="max-w-sm border border-surface-200 rounded-xl p-5 space-y-4">
        <div class="flex items-center gap-3">
          <atc-skeleton variant="circle" width="48px"></atc-skeleton>
          <div class="flex-1 space-y-2">
            <atc-skeleton variant="text" width="60%"></atc-skeleton>
            <atc-skeleton variant="text" width="40%"></atc-skeleton>
          </div>
        </div>
        <atc-skeleton variant="rounded" width="100%" height="120px"></atc-skeleton>
        <atc-skeleton variant="text" width="100%"></atc-skeleton>
        <atc-skeleton variant="text" width="75%"></atc-skeleton>
      </div>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-xs">
        <atc-skeleton variant="text" width="100%"></atc-skeleton>
        <atc-skeleton variant="circle" width="56px"></atc-skeleton>
        <atc-skeleton variant="rect" width="100%" height="80px"></atc-skeleton>
        <atc-skeleton variant="rounded" width="100%" height="80px"></atc-skeleton>
      </div>`,
  }),
};
