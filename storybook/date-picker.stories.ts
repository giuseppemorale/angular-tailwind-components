import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDatePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDatePicker> = {
  title: 'Forms/DatePicker',
  component: TailwindDatePicker,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;

export const Datepicker: StoryObj<TailwindDatePicker> = {
  render: args => ({
    props: args,
    template: `<tailwind-date-picker [label]="label" [placeholder]="placeholder" style="max-width:320px;display:block"></tailwind-date-picker>`
  }),
  args: { label: 'Date of Birth', placeholder: 'Pick a date' }
};

export const WithValue: StoryObj<TailwindDatePicker> = {
  render: () => ({
    template: `<tailwind-date-picker label="Event Date" style="max-width:320px;display:block"></tailwind-date-picker>`
  })
};

export const Disabled: StoryObj<TailwindDatePicker> = {
  render: () => ({
    template: `<tailwind-date-picker label="Date" [disabled]="true" style="max-width:320px;display:block"></tailwind-date-picker>`
  })
};
