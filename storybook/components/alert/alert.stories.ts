import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindAlert } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindAlert> = {
  title: 'Components/Alert',
  component: TailwindAlert,
  argTypes: {
    color: { control: 'select', options: ['slate','gray','zinc','neutral','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'] },
    title: { control: 'text' },
    dismissible: { control: 'boolean' },
    bordered: { control: 'boolean' }
  },
  args: {
    color: 'sky',
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
    color: 'sky',
    title: 'Information',
    dismissible: false,
    bordered: true
  }
};
