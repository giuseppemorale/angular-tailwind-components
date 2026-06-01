import type { Meta, StoryObj } from '@storybook/angular';
import {
  TailwindMeter,
  type TailwindMeterSegment
} from '../../../projects/angular-tailwind-components/src/public-api';

const sampleSegments: TailwindMeterSegment[] = [
  { label: 'Apps', value: 25, color: 'primary' },
  { label: 'Messages', value: 15, color: 'info' },
  { label: 'Media', value: 20, color: 'warning' },
  { label: 'System', value: 10, color: 'danger' }
];

const meta: Meta<TailwindMeter> = {
  title: 'Components/Meter',
  component: TailwindMeter,
  parameters: {
    docs: {
      description: {
        component:
          'Segmented **meter** bar: pass `segments` with `label`, `value`, and optional `color`. Values are scaled against **max** (default 100).'
      }
    }
  },
  argTypes: {
    max: { control: { type: 'number' } },
    showLabels: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    max: 100,
    showLabels: true,
    size: 'md'
  }
};
export default meta;

type Story = StoryObj<TailwindMeter>;

export const MultiSegment: Story = {
  render: args => ({
    props: { ...args, segments: sampleSegments },
    template: `
      <div class="max-w-xl">
        <tailwind-meter
          [segments]="segments"
          [max]="max"
          [showLabels]="showLabels"
          [size]="size" />
      </div>
    `
  })
};

export const SingleSegment: Story = {
  render: args => ({
    props: {
      ...args,
      segments: [{ label: 'Complete', value: 72, color: 'success' }] satisfies TailwindMeterSegment[]
    },
    template: `
      <div class="max-w-xl">
        <tailwind-meter [segments]="segments" [max]="max" [showLabels]="showLabels" [size]="size" />
      </div>
    `
  })
};

export const CustomMax: Story = {
  args: { max: 200, showLabels: true },
  render: args => ({
    props: {
      ...args,
      segments: [
        { label: 'A', value: 50, color: 'primary' },
        { label: 'B', value: 50, color: 'info' }
      ] as TailwindMeterSegment[]
    },
    template: `
      <div class="max-w-xl">
        <tailwind-meter [segments]="segments" [max]="max" [showLabels]="showLabels" [size]="size" />
      </div>
    `
  })
};
