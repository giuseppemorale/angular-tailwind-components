import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindDateTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Forms/DateTimePicker',
  component: TailwindDateTimePicker,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;
type Story = StoryObj<TailwindDateTimePicker>;

export const DatetimePicker: Story = {
  render: args => ({
    props: args,
    template: `<tailwind-datetime-picker ${argsToTemplate(args)}></tailwind-datetime-picker>`
  }),
  args: { label: 'Appointment Date & Time' }
};
