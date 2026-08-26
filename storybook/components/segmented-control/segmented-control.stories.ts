import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindSegmentedControl } from '../../../projects/angular-tailwind-components/src/public-api';

const OPTIONS = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map' }
];

const meta: Meta<TailwindSegmentedControl<string>> = {
  title: 'Form Controls/SegmentedControl',
  component: TailwindSegmentedControl,
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};
export default meta;

export const SegmentedControl: StoryObj<TailwindSegmentedControl<string>> = {
  parameters: { controls: { exclude: ['compareWith', 'ariaLabel'] } },
  render: args => ({
    props: { ...args, options: OPTIONS },
    template: `<tailwind-segmented-control ${argsToTemplate(args)} [options]="options" />`
  }),
  args: { label: 'View', size: 'md', fullWidth: false, disabled: false }
};

export const FullWidth: StoryObj<TailwindSegmentedControl<string>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { options: OPTIONS },
    template: `
      <div class="max-w-md">
        <tailwind-segmented-control label="View" [options]="options" [fullWidth]="true" />
      </div>`
  })
};

export const Sizes: StoryObj<TailwindSegmentedControl<string>> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { options: OPTIONS },
    template: `
      <div class="flex flex-col items-start gap-4">
        <tailwind-segmented-control size="xs" [options]="options" ariaLabel="View xs" />
        <tailwind-segmented-control size="sm" [options]="options" ariaLabel="View sm" />
        <tailwind-segmented-control size="md" [options]="options" ariaLabel="View md" />
        <tailwind-segmented-control size="lg" [options]="options" ariaLabel="View lg" />
      </div>`
  })
};

/**
 * The selected segment is marked by a single thumb that slides between positions rather than a
 * background that blinks on and off — the movement is what tells the eye where the selection went.
 */
export const SlidingThumb: StoryObj<TailwindSegmentedControl<string>> = {
  name: 'Thumb scorrevole',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'quarter', label: 'Quarter' }
      ],
      value: 'week'
    },
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-segmented-control [options]="options" [(value)]="value" label="Periodo" />
        <p class="text-sm text-fg-muted">Valore: <code>{{ value }}</code></p>
      </div>`
  })
};
