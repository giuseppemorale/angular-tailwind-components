import type { Meta, StoryObj } from '@storybook/angular';
import { AtcSelect } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcSelect> = {
  title: 'Components/Select',
  component: AtcSelect,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcSelect>;

const options = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

export const Default: Story = {
  render: (args) => ({
    props: { ...args, options },
    template: `<atc-select [label]="label" [options]="options" [placeholder]="placeholder" style="max-width:320px;display:block"></atc-select>`,
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
    template: `<atc-select label="Language" [options]="groupedOptions" style="max-width:320px;display:block"></atc-select>`,
  }),
};
