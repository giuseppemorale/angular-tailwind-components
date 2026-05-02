import type { Meta, StoryObj } from '@storybook/angular';
import { AtcDateTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcDateTimePicker> = {
  title: 'Components/DateTimePicker',
  component: AtcDateTimePicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcDateTimePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-datetime-picker [label]="label" style="max-width:480px;display:block"></atc-datetime-picker>`,
  }),
  args: { label: 'Appointment Date & Time' },
};
