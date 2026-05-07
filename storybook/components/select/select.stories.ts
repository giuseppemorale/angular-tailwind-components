import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSelect } from '../../../projects/angular-tailwind-components/src/public-api';

const FRAMEWORKS = [
  { value: 'angular', label: 'Angular' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' }
];

const meta: Meta<TailwindSelect> = {
  title: 'Forms/Select',
  component: TailwindSelect,
  parameters: { docs: { story: { height: '300px' } } }
};
export default meta;

export const Select: StoryObj<TailwindSelect> = {
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: FRAMEWORKS
  }
};

export const WithDisabledOptions: StoryObj<TailwindSelect> = {
  name: 'Con opzioni disabilitate',
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: [
      { value: 'angular', label: 'Angular' },
      { value: 'react', label: 'React (deprecated)', disabled: true },
      { value: 'vue', label: 'Vue' },
      { value: 'svelte', label: 'Svelte', disabled: true }
    ]
  }
};

export const WithError: StoryObj<TailwindSelect> = {
  name: 'Stato errore',
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: FRAMEWORKS,
    hasError: true,
    errorText: 'Seleziona un framework.'
  }
};

export const WithHelperText: StoryObj<TailwindSelect> = {
  name: 'Con helper text',
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: FRAMEWORKS,
    helperText: 'Scegli il framework che preferisci.'
  }
};

export const Sizes: StoryObj<TailwindSelect> = {
  name: 'Dimensioni',
  render: () => ({
    props: { options: FRAMEWORKS },
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-select label="xs" size="xs" placeholder="xs" [options]="options" />
        <tailwind-select label="sm" size="sm" placeholder="sm" [options]="options" />
        <tailwind-select label="md" size="md" placeholder="md" [options]="options" />
        <tailwind-select label="lg" size="lg" placeholder="lg" [options]="options" />
        <tailwind-select label="xl" size="xl" placeholder="xl" [options]="options" />
      </div>
    `
  })
};
