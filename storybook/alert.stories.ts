import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindAlert } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindAlert> = {
  title: 'Components/Alert',
  component: TailwindAlert,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<TailwindAlert>;

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-alert severity="info" title="Information">This is an informational alert.</tailwind-alert>
        <tailwind-alert severity="success" title="Success">Your action was completed successfully.</tailwind-alert>
        <tailwind-alert severity="warning" title="Warning">Please review before proceeding.</tailwind-alert>
        <tailwind-alert severity="danger" title="Error">An error occurred during the operation.</tailwind-alert>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `<tailwind-alert severity="info" title="Dismissible" [dismissible]="true">Click the X to dismiss this alert.</tailwind-alert>`,
  }),
};
