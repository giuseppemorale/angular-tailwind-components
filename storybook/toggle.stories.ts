import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindToggle } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindToggle> = {
  title: 'Forms/Toggle',
  component: TailwindToggle,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindToggle>;

export const Default: Story = {
  render: () => ({
    template: `<tailwind-toggle label="Enable notifications" />`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-toggle label="Extra Small" size="xs" />
        <tailwind-toggle label="Small" size="sm" />
        <tailwind-toggle label="Medium" size="md" />
        <tailwind-toggle label="Large" size="lg" />
        <tailwind-toggle label="Extra Large" size="xl" />
      </div>
    `,
  }),
};
