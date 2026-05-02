import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindAlert } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindAlert> = {
  title: 'Components/Alert',
  component: TailwindAlert,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' }
  }
};
export default meta;
type Story = StoryObj<TailwindAlert>;

export const AllSeverities: Story = {
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-alert severity="info" title="Information" message="This is an informational alert." />
        <tailwind-alert severity="success" title="Success" message="Your action was completed successfully." />
        <tailwind-alert severity="warning" title="Warning" message="Please review before proceeding." />
        <tailwind-alert severity="danger" title="Error" message="An error occurred during the operation." />
      </div>
    `
  })
};

export const Dismissible: Story = {
  render: () => ({
    template: `<tailwind-alert severity="info" title="Dismissible" [dismissible]="true" message="Click the X to dismiss this alert." />`
  })
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-alert severity="info" title="Information" message="This is an informational alert."  ${argsToTemplate(args)}/>
        <tailwind-alert severity="success" title="Success" message="Your action was completed successfully." />
        <tailwind-alert severity="warning" title="Warning" message="Please review before proceeding." />
        <tailwind-alert severity="danger" title="Error" message="An error occurred during the operation." />
      </div>
    `,
  }),
  args: {
    severity: 'info',
    title: '',
    message: '',
    dismissible: false,
    bordered: true
  }
};
