import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindTimePicker } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTimePicker> = {
  title: 'Forms/TimePicker',
  component: TailwindTimePicker,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '320px' } } },
};
export default meta;
type Story = StoryObj<TailwindTimePicker>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-time-picker [label]="label" style="max-width:240px;display:block"></tailwind-time-picker>`,
  }),
  args: { label: 'Meeting Time' },
};

export const With24h: Story = {
  render: () => ({
    template: `
      <div class="space-y-4 max-w-xs">
        <tailwind-time-picker label="Start Time" [use24h]="false"></tailwind-time-picker>
        <tailwind-time-picker label="End Time" [use24h]="true"></tailwind-time-picker>
      </div>`,
  }),
};


