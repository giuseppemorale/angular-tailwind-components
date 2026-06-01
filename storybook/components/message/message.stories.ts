import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindMessage } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMessage> = {
  title: 'Components/Message',
  component: TailwindMessage,
  decorators: [
    moduleMetadata({
      imports: [TailwindMessage]
    })
  ],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
    icon: { control: 'text' },
    iconSize: { control: 'number' }
  }
};
export default meta;

/** Four stacked rows; canvas height overrides global docs default so nothing is clipped. */
export const Message: StoryObj<TailwindMessage> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <tailwind-message color="success" icon="check-circle">
          Operation completed successfully.
        </tailwind-message>
        <tailwind-message color="warning" icon="shield-exclamation">
          Please review before proceeding.
        </tailwind-message>
        <tailwind-message color="danger" icon="x-circle">
          An error occurred during the operation.
        </tailwind-message>
        <tailwind-message color="info" icon="information-circle">
          This is an informational message.
        </tailwind-message>
      </div>`
  })
};

export const InForm: StoryObj<TailwindMessage> = {
  render: args => ({
    props: args,
    template: `
      <div class="max-w-sm space-y-2">
        <tailwind-input label="Email" placeholder="Enter your email" />
        <tailwind-message ${argsToTemplate(args)}>
          This email is already in use.
        </tailwind-message>
      </div>`
  }),
  args: {
    color: 'danger',
    icon: 'x-circle'
  }
};
