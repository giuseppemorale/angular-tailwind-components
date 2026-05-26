import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  TAILWIND_DATETIME_LANGUAGE,
  TailwindCalendarPanel
} from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCalendarPanel> = {
  title: 'Forms/CalendarPanel',
  component: TailwindCalendarPanel,
  parameters: { docs: { story: { height: '380px' } } }
};
export default meta;

export const CalendarPanel: StoryObj<TailwindCalendarPanel> = {
  args: {
    value: new Date(2026, 4, 15)
  }
};

export const WithReactiveForm: StoryObj<TailwindCalendarPanel> = {
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TailwindCalendarPanel, JsonPipe]
    })
  ],
  render: () => ({
    props: {
      control: new FormControl<Date | null>(new Date(2026, 0, 10))
    },
    template: `
      <div class="flex flex-col gap-3 max-w-sm">
        <tailwind-calendar-panel [formControl]="control" />
        <p class="text-xs text-neutral-600">Form value:</p>
        <pre class="text-xs bg-neutral-50 p-2 rounded border border-neutral-200">{{ control.value | json }}</pre>
      </div>
    `
  })
};

export const EnglishLanguage: StoryObj<TailwindCalendarPanel> = {
  decorators: [
    moduleMetadata({
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'en' }],
      imports: [TailwindCalendarPanel]
    })
  ],
  render: () => ({
    props: { selected: new Date(2026, 4, 15) },
    template: `<tailwind-calendar-panel [value]="selected" />`
  })
};

export const Disabled: StoryObj<TailwindCalendarPanel> = {
  decorators: [
    moduleMetadata({
      imports: [ReactiveFormsModule, TailwindCalendarPanel]
    })
  ],
  render: () => ({
    props: {
      control: new FormControl<Date | null>({ value: new Date(), disabled: true })
    },
    template: `<tailwind-calendar-panel [formControl]="control" />`
  })
};
