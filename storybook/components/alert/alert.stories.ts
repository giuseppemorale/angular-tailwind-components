import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindAlert } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindAlert> = {
  title: 'Components/Alert',
  component: TailwindAlert,
  argTypes: {
    severity: { control: 'select', options: ['success', 'warning', 'danger', 'info'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' }
  },
  args: {
    severity: 'info',
    title: '',
    message: '',
    dismissible: false,
    bordered: true
  }
};
export default meta;
type Story = StoryObj<TailwindAlert>;

export const Alert: Story = {
  render: args => ({
    props: args,
    template: `<tailwind-alert ${argsToTemplate(args)} />`
  }),
  args: {
    severity: 'info',
    title: 'Information',
    message: 'This is an informational alert.',
    dismissible: false,
    bordered: true
  }
};
