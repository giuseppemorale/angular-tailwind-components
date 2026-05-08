import { FormsModule } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindSlider } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSlider> = {
  title: 'Components/Slider',
  component: TailwindSlider,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, TailwindSlider]
    })
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible **slider** with optional **range** mode, horizontal or vertical layout, step snapping, and optional ticks. Implements `ControlValueAccessor` (`number` or `[number, number]` when `range` is true). API inspired by PrimeNG Slider.'
      },
      story: { height: '280px' }
    }
  },
  argTypes: {
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    range: { control: 'boolean' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    showTicks: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  },
  args: {
    min: 0,
    max: 100,
    step: 5,
    range: false,
    orientation: 'horizontal',
    showTicks: false,
    size: 'md'
  }
};
export default meta;

type Story = StoryObj<TailwindSlider>;

export const Default: Story = {
  render: args => ({
    props: { ...args, model: 40 },
    template: `
      <div class="max-w-md">
        <tailwind-slider
          [(ngModel)]="model"
          [min]="min"
          [max]="max"
          [step]="step"
          [range]="range"
          [orientation]="orientation"
          [showTicks]="showTicks"
          [size]="size" />
        <p class="mt-2 text-sm text-surface-600">Value: {{ model }}</p>
      </div>
    `
  })
};

export const Range: Story = {
  args: { range: true, step: 1 },
  parameters: { docs: { story: { height: '320px' } } },
  render: args => ({
    props: { ...args, model: [20, 70] as [number, number] },
    template: `
      <div class="max-w-md">
        <tailwind-slider
          [(ngModel)]="model"
          [min]="min"
          [max]="max"
          [step]="step"
          [range]="range"
          [orientation]="orientation"
          [showTicks]="showTicks"
          [size]="size" />
        <p class="mt-2 text-sm text-surface-600">Values: {{ model[0] }} — {{ model[1] }}</p>
      </div>
    `
  })
};

export const Vertical: Story = {
  args: { orientation: 'vertical', showTicks: true, step: 5 },
  parameters: { docs: { story: { height: '380px' } } },
  render: args => ({
    props: { ...args, model: 35 },
    template: `
      <div class="flex h-72 justify-center">
        <tailwind-slider
          [(ngModel)]="model"
          [min]="min"
          [max]="max"
          [step]="step"
          [range]="range"
          [orientation]="orientation"
          [showTicks]="showTicks"
          [size]="size" />
      </div>
    `
  })
};

export const Disabled: Story = {
  render: args => ({
    props: { ...args, model: 30 },
    template: `
      <div class="max-w-md">
        <tailwind-slider
          [(ngModel)]="model"
          [min]="min"
          [max]="max"
          [step]="step"
          [disabled]="true" />
      </div>
    `
  })
};
