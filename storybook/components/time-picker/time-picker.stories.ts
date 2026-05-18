import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  TAILWIND_DATETIME_LANGUAGE,
  TailwindTimePicker
} from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTimePicker> = {
  title: 'Forms/TimePicker',
  component: TailwindTimePicker,
  parameters: { docs: { story: { height: '220px' } } },
  argTypes: {
    label: { control: 'text' }
  }
};
export default meta;

export const TimePicker: StoryObj<TailwindTimePicker> = {
  args: { label: 'Meeting Time' }
};

export const WithReactiveForm: StoryObj<TailwindTimePicker> = {
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TailwindTimePicker, JsonPipe]
    })
  ],
  render: () => ({
    props: {
      control: new FormControl('14:30')
    },
    template: `
      <div class="max-w-sm min-h-48 flex flex-col gap-3 overflow-visible pb-8">
        <tailwind-time-picker [formControl]="control" label="Orario riunione" />
        <p class="text-xs text-neutral-600">Form value:</p>
        <pre class="text-xs bg-neutral-50 p-2 rounded border border-neutral-200">{{ control.value | json }}</pre>
      </div>
    `
  })
};

export const EnglishLanguage: StoryObj<TailwindTimePicker> = {
  decorators: [
    moduleMetadata({
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'en' }],
      imports: [TailwindTimePicker]
    })
  ],
  render: () => ({
    template: `
      <div class="max-w-sm min-h-48 overflow-visible pb-8">
        <tailwind-time-picker label="Meeting Time" />
      </div>
    `
  })
};

export const Disabled: StoryObj<TailwindTimePicker> = {
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TailwindTimePicker]
    })
  ],
  render: () => ({
    props: {
      control: new FormControl({ value: '09:00', disabled: true })
    },
    template: `
      <div class="max-w-sm">
        <tailwind-time-picker [formControl]="control" label="Orario (disabilitato)" />
      </div>
    `
  })
};
