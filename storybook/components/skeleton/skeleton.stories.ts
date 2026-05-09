import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TailwindCard, TailwindSkeleton } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSkeleton> = {
  title: 'Components/Skeleton',
  component: TailwindSkeleton,
  decorators: [
    moduleMetadata({
      imports: [TailwindCard, TailwindSkeleton]
    })
  ],
  argTypes: {
    variant: { control: 'select', options: ['text', 'circle', 'rect', 'rounded'] },
    width: { control: 'text' },
    height: { control: 'text' }
  }
};
export default meta;

export const Skeleton: StoryObj<TailwindSkeleton> = {
  args: {
    variant: 'text',
    width: '100%',
    height: '2rem'
  }
};

export const CardSkeleton: StoryObj<TailwindSkeleton> = {
  render: () => ({
    template: `
      <div class="max-w-lg">
        <tailwind-card [hasHeader]="false">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <tailwind-skeleton variant="circle" width="48px"></tailwind-skeleton>
              <div class="flex-1 space-y-2">
                <tailwind-skeleton variant="text" width="60%"></tailwind-skeleton>
                <tailwind-skeleton variant="text" width="40%"></tailwind-skeleton>
              </div>
            </div>
            <tailwind-skeleton variant="rounded" width="100%" height="120px"></tailwind-skeleton>
            <tailwind-skeleton variant="text" width="100%"></tailwind-skeleton>
          </div>
          <div tailwind-card-footer>
            <div class="flex justify-end items-center gap-3">
              <tailwind-skeleton variant="text" width="80px" height="36px"></tailwind-skeleton>
              <tailwind-skeleton variant="text" width="80px" height="36px"></tailwind-skeleton>
            </div>
          </div>
        </tailwind-card>
      </div>`
  })
};

export const AllVariants: StoryObj<TailwindSkeleton> = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-xs">
        <tailwind-skeleton variant="text" width="100%"></tailwind-skeleton>
        <tailwind-skeleton variant="circle" width="56px"></tailwind-skeleton>
        <tailwind-skeleton variant="rect" width="100%" height="80px"></tailwind-skeleton>
        <tailwind-skeleton variant="rounded" width="100%" height="80px"></tailwind-skeleton>
      </div>`
  })
};
