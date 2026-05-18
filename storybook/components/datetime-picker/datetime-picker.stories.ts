import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindDateTimePicker } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDateTimePicker> = {
  title: 'Forms/DateTimePicker',
  component: TailwindDateTimePicker,
  /** Altezza generosa: il pannello calendario è alto e altrimenti viene tagliato da overflow nei contenitori Storybook. */
  parameters: { docs: { story: { height: '720px' } } },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    format: { control: 'text' }
  }
};
export default meta;

export const DateTimepicker: StoryObj<TailwindDateTimePicker> = {
  render: args => ({
    props: args,
    template: `
      <div class="max-w-2xl min-h-128 overflow-visible pb-8">
        <tailwind-datetime-picker ${argsToTemplate(args)}></tailwind-datetime-picker>
      </div>
      `
  }),
  args: {
    label: 'Appointment Date & Time',
    placeholder: 'Select date and time',
    format: 'dd/MM/yyyy HH:mm'
  }
};

export const WithReactiveForm: StoryObj<TailwindDateTimePicker> = {
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TailwindDateTimePicker, JsonPipe]
    })
  ],
  render: () => ({
    props: {
      control: new FormControl<Date | null>(new Date(2026, 4, 7, 14, 30))
    },
    template: `
      <div class="max-w-2xl flex min-h-136 flex-col gap-3 overflow-visible pb-8">
        <tailwind-datetime-picker [formControl]="control" label="Scheduled at" />
        <p class="text-xs text-neutral-600">Form value (JSON):</p>
        <pre class="text-xs bg-neutral-50 p-2 rounded border border-neutral-200 overflow-auto">{{ control.value | json }}</pre>
      </div>
    `
  })
};
