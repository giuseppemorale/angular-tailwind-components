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
  title: 'Layout/Meter',
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
    decimals: { control: { type: 'number', min: 0, max: 6, step: 1 } },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    max: 100,
    showLabels: true,
    decimals: 0,
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
          [decimals]="decimals"
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
        <tailwind-meter [segments]="segments" [max]="max" [showLabels]="showLabels" [decimals]="decimals" [size]="size" />
      </div>
    `
  })
};

export const FloatDecimals: Story = {
  args: { decimals: 1, max: 100 },
  render: args => ({
    props: {
      ...args,
      segments: [
        { label: 'IT', value: 51.28205128205128, color: 'primary' },
        { label: 'EN', value: 20.51282051282051, color: 'info' },
        { label: 'DE', value: 17.94871794871795, color: 'danger' },
        { label: 'FR', value: 10.256410256410255, color: 'success' }
      ] as TailwindMeterSegment[]
    },
    template: `
      <div class="max-w-xl">
        <tailwind-meter [segments]="segments" [max]="max" [showLabels]="showLabels" [decimals]="decimals" [size]="size" />
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
        <tailwind-meter [segments]="segments" [max]="max" [showLabels]="showLabels" [decimals]="decimals" [size]="size" />
      </div>
    `
  })
};
