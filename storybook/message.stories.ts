import type { Meta, StoryObj } from '@storybook/angular';
import { AtcMessage } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcMessage> = {
  title: 'Components/Message',
  component: AtcMessage,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
  },
};
export default meta;
type Story = StoryObj<AtcMessage>;

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <atc-message severity="success">Operation completed successfully.</atc-message>
        <atc-message severity="warning">Please review before proceeding.</atc-message>
        <atc-message severity="danger">An error occurred during the operation.</atc-message>
        <atc-message severity="info">This is an informational message.</atc-message>
      </div>`,
  }),
};

export const InForm: Story = {
  render: () => ({
    template: `
      <div class="max-w-sm space-y-2">
        <atc-input label="Email" placeholder="Enter your email" />
        <atc-message severity="danger">This email is already in use.</atc-message>
      </div>`,
  }),
};
