import type { Meta, StoryObj } from '@storybook/angular';
import { AtcSpinner } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcSpinner> = {
  title: 'Components/Spinner',
  component: AtcSpinner,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcSpinner>;

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6">
        <atc-spinner size="xs" />
        <atc-spinner size="sm" />
        <atc-spinner size="md" />
        <atc-spinner size="lg" />
        <atc-spinner size="xl" />
      </div>
    `,
  }),
};

export const WithLabel: Story = {
  render: () => ({
    template: `<atc-spinner size="md" label="Loading data..." />`,
  }),
};
