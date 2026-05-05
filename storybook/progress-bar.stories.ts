import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindProgressBar } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindProgressBar> = {
  title: 'Components/ProgressBar',
  component: TailwindProgressBar,
  tags: ['autodocs'],
  args: {
    value: 0,
    label: '',
    showLabel: true,
    showValue: true,
    variant: 'primary',
    size: 'md',
    indeterminate: false,
    striped: false
  }
};
export default meta;

export const ProgressBar: StoryObj<TailwindProgressBar> = {
  args: {
    value: 65,
    label: 'Upload Progress',
    showLabel: true,
    showValue: true,
    variant: 'primary',
    size: 'md',
    indeterminate: false,
    striped: false
  }
};

export const AllVariants: StoryObj<TailwindProgressBar> = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-progress-bar [value]="30" label="Primary" variant="primary" />
        <tailwind-progress-bar [value]="50" label="Success" variant="success" />
        <tailwind-progress-bar [value]="70" label="Warning" variant="warning" />
        <tailwind-progress-bar [value]="90" label="Danger" variant="danger" />
      </div>
    `
  })
};

export const Indeterminate: StoryObj<TailwindProgressBar> = {
  args: {
    indeterminate: true,
    label: 'Loading...',
    showValue: false,
    striped: false
  }
};
