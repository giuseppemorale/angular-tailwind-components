import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindSelect } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSelect> = {
  title: 'Forms/Select',
  component: TailwindSelect,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '300px' } } },
};
export default meta;
type Story = StoryObj<TailwindSelect>;

const options = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
  render: (args) => ({
    props: { ...args, options },
    template: `<tailwind-select [label]="label" [options]="options" [placeholder]="placeholder" style="max-width:320px;display:block"></tailwind-select>`,
  }),
  args: { label: 'Framework', placeholder: 'Choose a framework' },
};

export const WithGroups: Story = {
  render: () => ({
    props: {
      groupedOptions: [
        { value: 'js', label: 'JavaScript' },
        { value: 'ts', label: 'TypeScript' },
        { value: 'py', label: 'Python' },
        { value: 'go', label: 'Go' },
      ],
    },
    template: `<tailwind-select label="Language" [options]="groupedOptions" style="max-width:320px;display:block"></tailwind-select>`,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-select [label]="label" [options]="options" [placeholder]="placeholder" style="max-width:320px;display:block" ${argsToTemplate(args)}></tailwind-select>`,
  }),
  args: {
    label: '',
    placeholder: '',
    options: [],
    size: 'md',
    required: false,
    helperText: '',
    errorText: '',
    hasError: false
  }
};
