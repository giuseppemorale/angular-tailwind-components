import type { Meta, StoryObj } from '@storybook/angular';
import { AtcProgressBar } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcProgressBar> = {
  title: 'Components/ProgressBar',
  component: AtcProgressBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcProgressBar>;

export const Default: Story = {
  render: () => ({
    template: `<atc-progress-bar [value]="65" label="Upload Progress" />`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <atc-progress-bar [value]="30" label="Primary" variant="primary" />
        <atc-progress-bar [value]="50" label="Success" variant="success" />
        <atc-progress-bar [value]="70" label="Warning" variant="warning" />
        <atc-progress-bar [value]="90" label="Danger" variant="danger" />
      </div>
    `,
  }),
};

export const Indeterminate: Story = {
  render: () => ({
    template: `<atc-progress-bar [indeterminate]="true" label="Loading..." [showValue]="false" />`,
  }),
};
