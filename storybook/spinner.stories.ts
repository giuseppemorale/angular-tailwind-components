import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSpinner } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSpinner> = {
  title: 'Components/Spinner',
  component: TailwindSpinner,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindSpinner>;

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <tailwind-spinner size="xs" />
        <tailwind-spinner size="sm" />
        <tailwind-spinner size="md" />
        <tailwind-spinner size="lg" />
        <tailwind-spinner size="xl" />
      </div>
    `,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: `<tailwind-spinner size="md" label="Loading data..." />`,
  }),
};
