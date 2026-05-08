import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
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
  render: args => ({
    props: args,
    template: `
    <div class="max-w-lg">
      <tailwind-select ${argsToTemplate(args)} />
    </div>
    `
  }),
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: FRAMEWORKS
  }
};

export const WithDisabledOptions: StoryObj<TailwindSelect> = {
  name: 'Con opzioni disabilitate',
  render: args => ({
    props: args,
    template: `
    <div class="max-w-lg">
      <tailwind-select ${argsToTemplate(args)} />
    </div>
    `
  }),
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
  render: args => ({
    props: args,
    template: `
    <div class="max-w-lg">
      <tailwind-select ${argsToTemplate(args)} />
    </div>
    `
  }),
  args: {
    label: 'Framework',
    placeholder: 'Choose a framework',
    options: FRAMEWORKS,
    hasError: true,
    errorText: 'Seleziona un framework.'
  }
};

export const Multiple: StoryObj<TailwindSelect<string>> = {
  name: 'Selezione multipla',
  args: {
    label: 'Framework',
    placeholder: 'Scegli uno o più framework',
    options: FRAMEWORKS,
    multiple: true,
    value: ['angular', 'vue']
  }
};

export const Sizes: StoryObj<TailwindSelect> = {
  name: 'Dimensioni',
  render: () => ({
    props: { options: FRAMEWORKS },
    template: `
      <div class="flex flex-col gap-4 max-w-lg">
        <tailwind-select label="xs" size="xs" placeholder="xs" [options]="options" />
        <tailwind-select label="sm" size="sm" placeholder="sm" [options]="options" />
        <tailwind-select label="md" size="md" placeholder="md" [options]="options" />
        <tailwind-select label="lg" size="lg" placeholder="lg" [options]="options" />
        <tailwind-select label="xl" size="xl" placeholder="xl" [options]="options" />
      </div>
    `
  })
};
