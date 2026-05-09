import { FormsModule } from '@angular/forms';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindSlider } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSlider> = {
  title: 'Forms/Slider',
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
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info']
    }
  }
};
export default meta;

export const Slider: StoryObj<TailwindSlider> = {
  render: args => ({
    props: { model: 40, ...args },
    template: `
      <div class="max-w-md">
        <tailwind-slider [(ngModel)]="model" ${argsToTemplate(args)} />
        <p class="mt-2 text-sm text-surface-600">Value: {{ model }}</p>
      </div>
    `
  }),
  args: {
    min: 0,
    max: 100,
    step: 5,
    range: false,
    orientation: 'horizontal',
    showTicks: false,
    size: 'md',
    variant: 'primary'
  }
};

export const Range: StoryObj<TailwindSlider> = {
  parameters: { docs: { story: { height: '320px' } } },
  render: args => ({
    props: { model: [20, 70] as [number, number], ...args },
    template: `
      <div class="max-w-md">
        <tailwind-slider [(ngModel)]="model" ${argsToTemplate(args)} />
        <p class="mt-2 text-sm text-surface-600">Values: {{ model[0] }} — {{ model[1] }}</p>
      </div>
    `
  }),
  args: {
    min: 0,
    max: 100,
    step: 1,
    range: true,
    orientation: 'horizontal',
    showTicks: false,
    size: 'md',
    variant: 'primary'
  }
};

export const Vertical: StoryObj<TailwindSlider> = {
  parameters: { docs: { story: { height: '380px' } } },
  render: args => ({
    props: { ...args, model: 35 },
    template: `
      <div class="flex h-72 justify-center">
        <tailwind-slider [(ngModel)]="model" ${argsToTemplate(args)} />
      </div>
    `
  }),
  args: {
    min: 0,
    max: 100,
    step: 5,
    range: false,
    orientation: 'vertical',
    showTicks: true,
    size: 'md',
    variant: 'primary'
  }
};
