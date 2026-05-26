import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDatePicker } from '../../../projects/angular-tailwind-components/src/public-api';
import { componentWrapperDecorator } from '@storybook/angular';

const storyWrapper = (story: string) => `<div class="max-w-xl min-h-128 overflow-visible pb-24">${story}</div>`;

const meta: Meta<TailwindDatePicker> = {
  title: 'Forms/DatePicker',
  component: TailwindDatePicker,
  decorators: [componentWrapperDecorator(storyWrapper)],
  parameters: { docs: { story: { height: '520px' } } }
};
export default meta;

export const Datepicker: StoryObj<TailwindDatePicker> = {
  args: { label: 'Date of Birth', placeholder: 'Pick a date' }
};

export const WithMinMax: StoryObj<TailwindDatePicker> = {
  render: args => ({
    props: {
      label: args.label,
      minDate: new Date(2026, 0, 1),
      maxDate: new Date(2026, 11, 31)
    },
    template: `
      <tailwind-date-picker
        [label]="label"
        [minDate]="minDate"
        [maxDate]="maxDate" />
    `
  }),
  args: { label: 'Appointment' },
  argTypes: {
    minDate: { control: false },
    maxDate: { control: false }
  }
};

/** Oggi fuori dal range: apri il calendario e verifica che "Oggi" sia visibile ma disabilitato. */
export const WithMinMaxTodayDisabled: StoryObj<TailwindDatePicker> = {
  render: args => ({
    props: {
      label: args.label,
      minDate: (() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth() - 1, 1);
      })(),
      maxDate: (() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth() - 1, 28);
      })()
    },
    template: `
      <tailwind-date-picker
        [label]="label"
        [minDate]="minDate"
        [maxDate]="maxDate" />
    `
  }),
  args: { label: 'Appointment (oggi disabilitato)' },
  argTypes: {
    minDate: { control: false },
    maxDate: { control: false }
  }
};
