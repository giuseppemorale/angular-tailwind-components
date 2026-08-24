import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindRating } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindRating> = {
  title: 'Form Controls/Rating',
  component: TailwindRating,
  argTypes: {
    max: { control: { type: 'number', min: 1, max: 10 } },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    clearable: { control: 'boolean' }
  }
};
export default meta;

export const Rating: StoryObj<TailwindRating> = {
  parameters: { controls: { exclude: ['ariaLabel'] } },
  render: args => ({
    props: args,
    template: `<tailwind-rating ${argsToTemplate(args)} />`
  }),
  args: { max: 5, size: 'md', readonly: false, disabled: false, clearable: true, value: 3 }
};

export const ReadOnly: StoryObj<TailwindRating> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-2">
        <tailwind-rating [value]="4" [readonly]="true" ariaLabel="Average rating" />
        <span class="text-sm text-neutral-500">4.0 out of 5</span>
      </div>`
  })
};

export const Sizes: StoryObj<TailwindRating> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <tailwind-rating size="xs" [value]="3" ariaLabel="xs" />
        <tailwind-rating size="sm" [value]="3" ariaLabel="sm" />
        <tailwind-rating size="md" [value]="3" ariaLabel="md" />
        <tailwind-rating size="lg" [value]="3" ariaLabel="lg" />
        <tailwind-rating size="xl" [value]="3" ariaLabel="xl" />
      </div>`
  })
};
