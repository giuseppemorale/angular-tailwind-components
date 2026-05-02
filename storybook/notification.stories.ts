import type { Meta, StoryObj } from '@storybook/angular';
import { AtcNotification } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcNotification> = {
  title: 'Components/Notification',
  component: AtcNotification,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
  },
};
export default meta;
type Story = StoryObj<AtcNotification>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <atc-notification [severity]="severity" [title]="title" [dismissible]="dismissible">
        This is a notification message with relevant details.
      </atc-notification>`,
  }),
  args: { severity: 'info', title: 'Information', dismissible: true },
};

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-lg">
        <atc-notification severity="success" title="Success">Your changes have been saved successfully.</atc-notification>
        <atc-notification severity="warning" title="Warning">Your session will expire in 5 minutes.</atc-notification>
        <atc-notification severity="danger" title="Error">Failed to connect to the server.</atc-notification>
        <atc-notification severity="info" title="Info">A new version is available.</atc-notification>
      </div>`,
  }),
};
