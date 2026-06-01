import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindBadge } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBadge> = {
  title: 'Display/Badge',
  component: TailwindBadge,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
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
  args: { color: 'primary', size: 'md', dot: false, rounded: false }
};
