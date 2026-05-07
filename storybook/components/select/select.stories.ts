import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSelect } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSelect> = {
  title: 'Forms/Select',
  component: TailwindSelect,
  tags: ['autodocs'],
  parameters: { docs: { story: { height: '300px' } } }
};
export default meta;

export const Select: StoryObj<TailwindSelect> = {
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: [
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte' }
    ]
  }
};
