import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindNumberInput } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindNumberInput> = {
  title: 'Form Controls/NumberInput',
  component: TailwindNumberInput,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    step: { control: 'number' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    hasError: { control: 'boolean' }
  }
};
export default meta;

export const NumberInput: StoryObj<TailwindNumberInput> = {
  parameters: { controls: { exclude: ['ariaLabel', 'errorText'] } },
  render: args => ({
    props: args,
    template: `<div class="max-w-48"><tailwind-number-input ${argsToTemplate(args)} /></div>`
  }),
  args: { label: 'Quantity', step: 1, min: 0, max: 10, value: 1, helperText: 'Between 0 and 10' }
};

export const Bounded: StoryObj<TailwindNumberInput> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex gap-6">
        <div class="max-w-48">
          <tailwind-number-input label="At the minimum" [min]="0" [max]="5" [value]="0" />
        </div>
        <div class="max-w-48">
          <tailwind-number-input label="At the maximum" [min]="0" [max]="5" [value]="5" />
        </div>
      </div>`
  })
};

export const Decimals: StoryObj<TailwindNumberInput> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="max-w-48">
        <tailwind-number-input label="Price" [step]="0.25" [min]="0" [value]="1.5" helperText="Steps of 0.25" />
      </div>`
  })
};
