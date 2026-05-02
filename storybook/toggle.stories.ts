import type { Meta, StoryObj } from '@storybook/angular';
import { AtcToggle } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcToggle> = {
  title: 'Components/Toggle',
  component: AtcToggle,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcToggle>;

export const Default: Story = {
  render: () => ({
    template: `<atc-toggle label="Enable notifications" />`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-4">
        <atc-toggle label="Extra Small" size="xs" />
        <atc-toggle label="Small" size="sm" />
        <atc-toggle label="Medium" size="md" />
        <atc-toggle label="Large" size="lg" />
        <atc-toggle label="Extra Large" size="xl" />
      </div>
    `,
  }),
};
