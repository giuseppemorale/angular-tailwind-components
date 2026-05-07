import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindDateTimePicker } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Forms/DateTimePicker',
  component: TailwindDateTimePicker,
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;

export const DateTimepicker: StoryObj<TailwindDateTimePicker> = {
  render: args => ({
    props: args,
    template: `
      <div class="max-w-2xl">
        <tailwind-datetime-picker ${argsToTemplate(args)}></tailwind-datetime-picker>
      </div>
      `
  }),
  args: { label: 'Appointment Date & Time' }
};
