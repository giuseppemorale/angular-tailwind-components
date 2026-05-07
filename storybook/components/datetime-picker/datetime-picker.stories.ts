import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindDateTimePicker } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Forms/DateTimePicker',
  component: TailwindDateTimePicker,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;
type Story = StoryObj<TailwindDateTimePicker>;

export const DateTimepicker: Story = {
  args: { label: 'Appointment Date & Time' }
};
