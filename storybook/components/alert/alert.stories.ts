import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindAlert } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindAlert> = {
  title: 'Components/Alert',
  component: TailwindAlert,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' },
    showActions: { control: 'boolean' }
  },
  args: {
    color: 'info',
    title: '',
    dismissible: false,
    bordered: true
  }
};
export default meta;

export const Alert: StoryObj<TailwindAlert> = {
  render: args => ({
    props: args,
    template: `<tailwind-alert ${argsToTemplate(args)}>
    This is an informational alert.
    </tailwind-alert>`
  }),
  args: {
    color: 'info',
    title: 'Information',
    dismissible: false,
    bordered: true,
    showActions: false
  }
};

export const WithActions: StoryObj<TailwindAlert> = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3 max-w-lg">
        <tailwind-alert color="warning" title="Storage almost full" [dismissible]="true" [showActions]="true" [bordered]="false">
          You are using 4.8 GB of your 5 GB storage limit.
          <div tailwind-alert-actions>
            <div class="flex gap-2">
              <tailwind-button color="warning" kind="outlined">Manage storage</tailwind-button>
              <tailwind-button color="warning" kind="text">Dismiss</tailwind-button>
            </div>
          </div>
        </tailwind-alert>
        <tailwind-alert color="info" title="New update available" [dismissible]="true" [showActions]="true" [bordered]="false">
          Version 21.0 includes performance improvements and new features.
          <div tailwind-alert-actions>
            <div class="flex gap-2">
              <tailwind-button>Update now</tailwind-button>
              <tailwind-button color="secondary" kind="text">Later</tailwind-button>
            </div>
          </div>
        </tailwind-alert>
      </div>`
  })
};
