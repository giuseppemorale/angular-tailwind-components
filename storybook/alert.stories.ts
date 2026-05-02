import type { Meta, StoryObj } from '@storybook/angular';
import { AtcAlert } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcAlert> = {
  title: 'Components/Alert',
  component: AtcAlert,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AtcAlert>;

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <atc-alert severity="info" title="Information">This is an informational alert.</atc-alert>
        <atc-alert severity="success" title="Success">Your action was completed successfully.</atc-alert>
        <atc-alert severity="warning" title="Warning">Please review before proceeding.</atc-alert>
        <atc-alert severity="danger" title="Error">An error occurred during the operation.</atc-alert>
      </div>
    `,
  }),
};

export const Dismissible: Story = {
  render: () => ({
    template: `<atc-alert severity="info" title="Dismissible" [dismissible]="true">Click the X to dismiss this alert.</atc-alert>`,
  }),
};
