import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindBadge } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindBadge> = {
  title: 'Components/Badge',
  component: TailwindBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'neutral', 'success', 'warning', 'danger', 'info'] },
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
  args: { variant: 'primary', size: 'md', dot: false, rounded: false }
};

export const WithDot: StoryObj<TailwindBadge> = {
  render: args => ({
    props: args,
    template: `<tailwind-badge ${argsToTemplate(args)}>With dot</tailwind-badge>`
  }),
  args: { variant: 'success', size: 'md', dot: true, rounded: false }
};

export const Rounded: StoryObj<TailwindBadge> = {
  render: args => ({
    props: args,
    template: `<tailwind-badge ${argsToTemplate(args)}>With pill</tailwind-badge>`
  }),
  args: { variant: 'primary', size: 'md', dot: false, rounded: true }
};
