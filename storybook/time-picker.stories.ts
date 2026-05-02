import type { Meta, StoryObj } from '@storybook/angular';
import { AtcTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcTimePicker> = {
  title: 'Components/TimePicker',
  component: AtcTimePicker,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcTimePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-time-picker [label]="label" style="max-width:240px;display:block"></atc-time-picker>`,
  }),
  args: { label: 'Meeting Time' },
};

export const With24h: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-xs">
        <atc-time-picker label="Start Time" [use24h]="false"></atc-time-picker>
        <atc-time-picker label="End Time" [use24h]="true"></atc-time-picker>
      </div>`,
  }),
};
