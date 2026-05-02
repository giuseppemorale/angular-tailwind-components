import type { Meta, StoryObj } from '@storybook/angular';
import { AtcDatePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcDatePicker> = {
  title: 'Components/DatePicker',
  component: AtcDatePicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcDatePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-date-picker [label]="label" [placeholder]="placeholder" style="max-width:320px;display:block"></atc-date-picker>`,
  }),
  args: { label: 'Date of Birth', placeholder: 'Pick a date' },
};

export const WithValue: Story = {
  render: () => ({
    template: `<atc-date-picker label="Event Date" style="max-width:320px;display:block"></atc-date-picker>`,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `<atc-date-picker label="Date" [disabled]="true" style="max-width:320px;display:block"></atc-date-picker>`,
  }),
};
