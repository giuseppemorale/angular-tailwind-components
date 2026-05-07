import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTimePicker } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTimePicker> = {
  title: 'Forms/TimePicker',
  component: TailwindTimePicker
};
export default meta;

export const TimePicker: StoryObj<TailwindTimePicker> = {
  args: { label: 'Meeting Time' }
};
