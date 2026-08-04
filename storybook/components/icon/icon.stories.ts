import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TAILWIND_HEROICON_NAMES, TailwindIcon } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindIcon> = {
  title: 'Display/Icon',
  component: TailwindIcon,
  argTypes: {
    icon: { control: 'select', options: TAILWIND_HEROICON_NAMES },
    size: { control: { type: 'number', min: 16, max: 64, step: 1 } }
  }
};
export default meta;

export const Icon: StoryObj<TailwindIcon> = {
  render: args => ({
    props: args,
    template: `<tailwind-icon ${argsToTemplate(args)} />`
  }),
  args: {
    icon: 'bell',
    size: 24
  }
};

export const Sizes: StoryObj<TailwindIcon> = {
  name: 'Dimensioni',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Attributo **`size`** in pixel (16–64, valori fuori range vengono clampati).'
      }
    }
  },
  render: () => ({
    template: `
      <div class="flex items-end gap-4 text-neutral-800 dark:text-neutral-100">
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="16" />
          <span class="text-xs text-neutral-500">16</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="20" />
          <span class="text-xs text-neutral-500">20</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="24" />
          <span class="text-xs text-neutral-500">24</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" />
          <span class="text-xs text-neutral-500">32</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="40" />
          <span class="text-xs text-neutral-500">40</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="48" />
          <span class="text-xs text-neutral-500">48</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="64" />
          <span class="text-xs text-neutral-500">64</span>
        </div>
      </div>
    `
  })
};

export const Colors: StoryObj<TailwindIcon> = {
  name: 'Colori',
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Il colore si imposta con utility **`text-*`** sull’input **`class`** (maschera CSS sul glifo interno).'
      }
    }
  },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-6 text-neutral-800 dark:text-neutral-100">
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-neutral-600" />
          <span class="text-xs text-neutral-500">neutral</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-primary-600" />
          <span class="text-xs text-neutral-500">primary</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-success-600" />
          <span class="text-xs text-neutral-500">success</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-warning-600" />
          <span class="text-xs text-neutral-500">warning</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-danger-600" />
          <span class="text-xs text-neutral-500">danger</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <tailwind-icon icon="bell" [size]="32" class="text-info-600" />
          <span class="text-xs text-neutral-500">info</span>
        </div>
      </div>
    `
  })
};
