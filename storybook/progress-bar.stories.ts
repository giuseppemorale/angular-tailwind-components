import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindProgressBar } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindProgressBar> = {
  title: 'Components/ProgressBar',
  component: TailwindProgressBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindProgressBar>;

export const Default: Story = {
  render: () => ({
    template: `<tailwind-progress-bar [value]="65" label="Upload Progress" />`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-progress-bar [value]="30" label="Primary" variant="primary" />
        <tailwind-progress-bar [value]="50" label="Success" variant="success" />
        <tailwind-progress-bar [value]="70" label="Warning" variant="warning" />
        <tailwind-progress-bar [value]="90" label="Danger" variant="danger" />
      </div>
    `,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `<tailwind-progress-bar [indeterminate]="true" label="Loading..." [showValue]="false" />`,
  }),
};
