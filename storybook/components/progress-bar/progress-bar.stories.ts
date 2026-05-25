import type { Meta, StoryObj } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindProgressBar } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindProgressBar> = {
  title: 'Components/ProgressBar',
  component: TailwindProgressBar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    color: { control: 'select', options: [...TAILWIND_PALETTES] }
  }
};
export default meta;

export const ProgressBar: StoryObj<TailwindProgressBar> = {
  args: {
    value: 65,
    label: 'Upload Progress',
    showLabel: true,
    showValue: true,
    color: 'neutral',
    size: 'md',
    indeterminate: false,
    striped: false
  }
};

export const AllVariants: StoryObj<TailwindProgressBar> = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-progress-bar [value]="30" label="Neutral" color="neutral" />
        <tailwind-progress-bar [value]="50" label="Green" color="green" />
        <tailwind-progress-bar [value]="70" label="Amber" color="amber" />
        <tailwind-progress-bar [value]="90" label="Red" color="red" />
      </div>
    `
  })
};

export const Indeterminate: StoryObj<TailwindProgressBar> = {
  args: {
    color: 'neutral',
    size: 'md',
    indeterminate: true,
    label: 'Loading...',
    showValue: false,
    showLabel: true,
    striped: false
  }
};
