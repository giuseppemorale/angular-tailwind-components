import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSelect } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSelect> = {
  title: 'Components/Select',
  component: TailwindSelect,
  tags: ['autodocs'],
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
