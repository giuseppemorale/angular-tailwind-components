import { JsonPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  argsToTemplate,
  componentWrapperDecorator,
  moduleMetadata,
  type Meta,
  type StoryObj
} from '@storybook/angular';
import {
  TAILWIND_DATETIME_LANGUAGE,
  TailwindCalendarPanel
} from '../../../projects/angular-tailwind-components/src/public-api';

function dateAroundToday(offsetMin: number, offsetMax: number) {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  return {
    value: new Date(y, m, d),
    minDate: new Date(y, m, d + offsetMin),
    maxDate: new Date(y, m, d + offsetMax)
  };
}

function previousMonthRange() {
  const prevMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const y = prevMonth.getFullYear();
  const m = prevMonth.getMonth();
  return {
    value: new Date(y, m, 10),
    minDate: new Date(y, m, 1),
    maxDate: new Date(y, m, 28)
  };
}

const meta: Meta<TailwindCalendarPanel> = {
  title: 'Form Controls/CalendarPanel',
  component: TailwindCalendarPanel,
  decorators: [componentWrapperDecorator(story => `<div class="max-w-sm overflow-visible pb-8">${story}</div>`)],
  parameters: { docs: { story: { height: '420px' } } },
  render: args => ({
    props: args,
    template: `<tailwind-calendar-panel ${argsToTemplate(args)} />`
  }),
  argTypes: {
    value: { control: 'date', description: 'Data selezionata (CVA / model)' },
    minDate: { control: 'date', description: 'Data minima inclusiva' },
    maxDate: { control: 'date', description: 'Data massima inclusiva' },
    calendarView: {
      control: 'select',
      options: ['days', 'months', 'years'],
      description: 'Vista corrente del calendario'
    },
    viewMonth: { control: { type: 'number', min: 0, max: 11 }, description: 'Mese visualizzato (0–11)' },
    viewYear: { control: 'number', description: 'Anno visualizzato' },
    highlightDate: { control: 'date', description: 'Data evidenziata (uso interno nei picker)' },
    months: { control: false },
    weekDays: { control: false },
    daySelect: { control: false }
  }
};
export default meta;

export const CalendarPanel: StoryObj<TailwindCalendarPanel> = {
  parameters: { controls: { exclude: ['minDate', 'maxDate', 'highlightDate'] } },
  args: {
    value: new Date(2026, 4, 15),
    calendarView: 'days',
    viewMonth: 4,
    viewYear: 2026
  }
};

export const WithMinMax: StoryObj<TailwindCalendarPanel> = {
  parameters: { controls: { exclude: ['highlightDate'] } },
  args: dateAroundToday(-5, 5)
};

/** Oggi fuori dal range: il pulsante «Oggi» è visibile ma disabilitato. */
export const WithMinMaxTodayDisabled: StoryObj<TailwindCalendarPanel> = {
  parameters: { controls: { exclude: ['highlightDate'] } },
  args: previousMonthRange()
};

export const WithReactiveForm: StoryObj<TailwindCalendarPanel> = {
  parameters: { controls: { disable: true } },
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
  parameters: { controls: { exclude: ['minDate', 'maxDate', 'highlightDate'] } },
  decorators: [
    moduleMetadata({
      providers: [{ provide: TAILWIND_DATETIME_LANGUAGE, useValue: 'en' }],
      imports: [TailwindCalendarPanel]
    })
  ],
  args: {
    value: new Date(2026, 4, 15),
    calendarView: 'days',
    viewMonth: 4,
    viewYear: 2026
  }
};

export const Disabled: StoryObj<TailwindCalendarPanel> = {
  parameters: { controls: { disable: true } },
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
