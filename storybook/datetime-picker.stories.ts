import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindDateTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Forms/DateTimePicker',
  component: TailwindDateTimePicker,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '380px' } } },
};
export default meta;
type Story = StoryObj<TailwindDateTimePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-datetime-picker [label]="label" style="max-width:480px;display:block"></tailwind-datetime-picker>`,
  }),
  args: { label: 'Appointment Date & Time' },
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-datetime-picker [label]="label" style="max-width:480px;display:block" ${argsToTemplate(args)}></tailwind-datetime-picker>`,
  }),
  args: {
    label: ''
  }
};
