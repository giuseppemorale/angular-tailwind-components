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
    kind: { control: 'select', options: ['solid', 'soft', 'outlined'] },
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

/** The same semantic decision expressed with three levels of weight, at identical metrics. */
export const Kinds: StoryObj<TailwindBadge> = {
  name: 'Varianti',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <tailwind-badge kind="solid" color="primary">Solid</tailwind-badge>
          <tailwind-badge kind="solid" color="success">Solid</tailwind-badge>
          <tailwind-badge kind="solid" color="danger">Solid</tailwind-badge>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <tailwind-badge kind="soft" color="primary">Soft</tailwind-badge>
          <tailwind-badge kind="soft" color="success">Soft</tailwind-badge>
          <tailwind-badge kind="soft" color="danger">Soft</tailwind-badge>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <tailwind-badge kind="outlined" color="primary">Outlined</tailwind-badge>
          <tailwind-badge kind="outlined" color="success">Outlined</tailwind-badge>
          <tailwind-badge kind="outlined" color="danger">Outlined</tailwind-badge>
        </div>
      </div>`
  })
};
