import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindNotification } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindNotification> = {
  title: 'Components/Notification',
  component: TailwindNotification,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
  },
};
export default meta;
type Story = StoryObj<TailwindNotification>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <tailwind-notification [severity]="severity" [title]="title" [dismissible]="dismissible">
        This is a notification message with relevant details.
      </tailwind-notification>`,
  }),
  args: { severity: 'info', title: 'Information', dismissible: true },
};

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-lg">
        <tailwind-notification severity="success" title="Success">Your changes have been saved successfully.</tailwind-notification>
        <tailwind-notification severity="warning" title="Warning">Your session will expire in 5 minutes.</tailwind-notification>
        <tailwind-notification severity="danger" title="Error">Failed to connect to the server.</tailwind-notification>
        <tailwind-notification severity="info" title="Info">A new version is available.</tailwind-notification>
      </div>`,
  }),
};

export const WithActions: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-lg">
        <tailwind-notification severity="warning" title="Storage almost full">
          You are using 4.8 GB of your 5 GB storage limit.
          <tailwind-notification-actions>
            <div class="flex gap-2 mt-2">
              <tailwind-button size="sm" variant="outline">Manage storage</tailwind-button>
              <tailwind-button size="sm" variant="ghost">Dismiss</tailwind-button>
            </div>
          </tailwind-notification-actions>
        </tailwind-notification>
        <tailwind-notification severity="info" title="New update available">
          Version 2.0 includes performance improvements and new features.
          <tailwind-notification-actions>
            <div class="flex gap-2 mt-2">
              <tailwind-button size="sm">Update now</tailwind-button>
              <tailwind-button size="sm" variant="ghost">Later</tailwind-button>
            </div>
          </tailwind-notification-actions>
        </tailwind-notification>
      </div>`,
  }),
};
