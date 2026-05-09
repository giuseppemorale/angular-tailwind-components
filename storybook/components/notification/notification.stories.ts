import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindNotification } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindNotification> = {
  title: 'Components/Notification',
  component: TailwindNotification,
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] }
  }
};
export default meta;

export const Notification: StoryObj<TailwindNotification> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-notification [severity]="severity" [title]="title" [dismissible]="dismissible">
        This is a notification message with relevant details.
      </tailwind-notification>`
  }),
  args: { severity: 'info', title: 'Information', dismissible: true }
};

export const WithActions: StoryObj<TailwindNotification> = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-lg">
          <tailwind-notification severity="warning" title="Storage almost full" [showActions]="true">
          You are using 4.8 GB of your 5 GB storage limit.
          <div tailwind-notification-actions>
            <div class="flex gap-2">
              <tailwind-button size="sm" color="warning" kind="outlined">Manage storage</tailwind-button>
              <tailwind-button size="sm" color="warning" kind="text">Dismiss</tailwind-button>
            </div>
          </div>
        </tailwind-notification>
        <tailwind-notification severity="info" title="New update available" [showActions]="true">
          Version 2.0 includes performance improvements and new features.
          <div tailwind-notification-actions>
            <div class="flex gap-2">
              <tailwind-button size="sm">Update now</tailwind-button>
              <tailwind-button size="sm" color="secondary" kind="text">Later</tailwind-button>
            </div>
          </div>
        </tailwind-notification>
      </div>`
  })
};
