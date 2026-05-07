import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDatePicker } from '../../../projects/angular-tailwind-components/src/public-api';
import { componentWrapperDecorator } from '@storybook/angular';

const meta: Meta<TailwindDatePicker> = {
  title: 'Forms/DatePicker',
  component: TailwindDatePicker,
  decorators: [componentWrapperDecorator(story => `<div class="max-w-xl">${story}</div>`)],
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;

export const Datepicker: StoryObj<TailwindDatePicker> = {
  args: { label: 'Date of Birth', placeholder: 'Pick a date' }
};
