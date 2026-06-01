import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindProgressBar } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindProgressBar> = {
  title: 'Components/ProgressBar',
  component: TailwindProgressBar,
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    },
    color: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info', 'transparent']
    }
  }
};
export default meta;

export const ProgressBar: StoryObj<TailwindProgressBar> = {
  args: {
    value: 65,
    label: 'Upload Progress',
    showLabel: true,
    showValue: true,
    color: 'primary',
    size: 'md',
    indeterminate: false,
    striped: false
  }
};

export const AllVariants: StoryObj<TailwindProgressBar> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-progress-bar [value]="30" label="Primary" color="primary" />
        <tailwind-progress-bar [value]="50" label="Success" color="success" />
        <tailwind-progress-bar [value]="70" label="Warning" color="warning" />
        <tailwind-progress-bar [value]="90" label="Danger" color="danger" />
      </div>
    `
  })
};

export const Indeterminate: StoryObj<TailwindProgressBar> = {
  parameters: { controls: { exclude: ['value', 'showValue', 'striped'] } },
  args: {
    color: 'primary',
    size: 'md',
    indeterminate: true,
    label: 'Loading...',
    showValue: false,
    showLabel: true,
    striped: false
  }
};
