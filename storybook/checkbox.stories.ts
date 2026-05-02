import type { Meta, StoryObj } from '@storybook/angular';
import { AtcCheckbox } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcCheckbox> = {
  title: 'Components/Checkbox',
  component: AtcCheckbox,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    checked: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<AtcCheckbox>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `<atc-checkbox [label]="label" [size]="size"></atc-checkbox>`,
  }),
  args: { label: 'Accept terms and conditions', size: 'md' },
};

export const States: Story = {
  render: () => ({
    template: `
      <div class="space-y-3">
        <atc-checkbox label="Unchecked" />
        <atc-checkbox label="Checked" [checked]="true" />
        <atc-checkbox label="Small" size="sm" />
        <atc-checkbox label="Large" size="lg" />
      </div>`,
  }),
};

export const CheckboxGroup: Story = {
  render: () => ({
    template: `
      <div class="space-y-2">
        <p class="text-sm font-medium text-surface-700 mb-3">Select your interests:</p>
        <atc-checkbox label="Angular" />
        <atc-checkbox label="TypeScript" />
        <atc-checkbox label="Tailwind CSS" />
        <atc-checkbox label="Storybook" />
      </div>`,
  }),
};
