import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindBadge } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBadge> = {
  title: 'Components/Badge',
  component: TailwindBadge,
  argTypes: {
    color: { control: 'select', options: [...TAILWIND_PALETTES] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    dot: { control: 'boolean' },
    rounded: { control: 'boolean' }
  }
};
export default meta;

export const Badge: StoryObj<TailwindBadge> = {
  render: args => ({
    props: args,
    template: `<tailwind-badge ${argsToTemplate(args)}>Badge</tailwind-badge>`
  }),
  args: { color: 'neutral', size: 'md', dot: false, rounded: false }
};
