import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDatePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDatePicker> = {
  title: 'Components/DatePicker',
  component: TailwindDatePicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindDatePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-date-picker [label]="label" [placeholder]="placeholder" style="max-width:320px;display:block"></tailwind-date-picker>`,
  }),
  args: { label: 'Date of Birth', placeholder: 'Pick a date' },
};

export const WithValue: Story = {
  render: () => ({
    template: `<tailwind-date-picker label="Event Date" style="max-width:320px;display:block"></tailwind-date-picker>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<tailwind-date-picker label="Date" [disabled]="true" style="max-width:320px;display:block"></tailwind-date-picker>`,
  }),
};
