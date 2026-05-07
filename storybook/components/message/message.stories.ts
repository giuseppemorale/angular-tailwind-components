import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindMessage } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMessage> = {
  title: 'Components/Message',
  component: TailwindMessage,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
  },
  args: {
    severity: 'info'
  },
};
export default meta;
type Story = StoryObj<TailwindMessage>;

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <tailwind-message severity="success">Operation completed successfully.</tailwind-message>
        <tailwind-message severity="warning">Please review before proceeding.</tailwind-message>
        <tailwind-message severity="danger">An error occurred during the operation.</tailwind-message>
        <tailwind-message severity="info">This is an informational message.</tailwind-message>
      </div>`,
  }),
};

export const InForm: Story = {
  render: () => ({
    template: `
      <div class="max-w-sm space-y-2">
        <tailwind-input label="Email" placeholder="Enter your email" />
        <tailwind-message severity="danger">This email is already in use.</tailwind-message>
      </div>`,
  }),
};


