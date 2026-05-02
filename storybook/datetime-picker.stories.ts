import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDateTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Components/DateTimePicker',
  component: TailwindDateTimePicker,
  tags: ['autodocs'],
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
