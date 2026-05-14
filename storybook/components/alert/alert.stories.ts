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
    severity: 'info',
    title: 'Information',
    dismissible: false,
    bordered: true
  }
};
