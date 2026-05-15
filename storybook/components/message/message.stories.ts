import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindIcon, TailwindMessage } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindMessage> = {
  title: 'Components/Message',
  component: TailwindMessage,
  decorators: [
    moduleMetadata({
      imports: [TailwindIcon, TailwindMessage]
    })
  ],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] }
  }
};
export default meta;

/** Four stacked rows; canvas height overrides global docs default so nothing is clipped. */
export const Severities: StoryObj<TailwindMessage> = {
  parameters: {
    docs: {
      story: {
        height: '520px'
      }
    }
  },
  render: args => ({
    props: args,
    template: `
      <div class="flex flex-col gap-2 max-w-md">
        <tailwind-message severity="success">
          <div class="flex items-center gap-2">
            <tailwind-icon icon="check-circle" class="text-success-600 shrink-0" />
            <span>Operation completed successfully.</span>
          </div>
        </tailwind-message>
        <tailwind-message severity="warning">
          <div class="flex items-center gap-2">
            <tailwind-icon icon="shield-exclamation" class="text-warning-600 shrink-0" />
            <span>Please review before proceeding.</span>
          </div>
        </tailwind-message>
        <tailwind-message severity="danger">
          <div class="flex items-center gap-2">
            <tailwind-icon icon="x-circle" class="text-danger-600 shrink-0" />
            <span>An error occurred during the operation.</span>
          </div>
        </tailwind-message>
        <tailwind-message severity="info">
          <div class="flex items-center gap-2">
            <tailwind-icon icon="info-circle" class="text-info-600 shrink-0" />
            <span>This is an informational message.</span>
          </div>
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
          <div class="flex items-center gap-2">
            <tailwind-icon icon="x-circle" class="text-danger-600 shrink-0" />
            This email is already in use.
          </div>
        </tailwind-message>
      </div>`
  }),
  args: {
    severity: 'danger'
  }
};
