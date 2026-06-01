import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindChip } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindChip> = {
  title: 'Display/Chip',
  component: TailwindChip,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    removable: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};
export default meta;

export const Chip: StoryObj<TailwindChip> = {
  render: args => ({
    props: args,
    template: `<tailwind-chip ${argsToTemplate(args)}>Angular</tailwind-chip>`
  }),
  args: { color: 'secondary', size: 'sm', removable: true, disabled: false }
};

export const Colors: StoryObj<TailwindChip> = {
  name: 'Colori',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap gap-2">
        <tailwind-chip color="primary">Primary</tailwind-chip>
        <tailwind-chip color="secondary">Secondary</tailwind-chip>
        <tailwind-chip color="success">Success</tailwind-chip>
        <tailwind-chip color="warning">Warning</tailwind-chip>
        <tailwind-chip color="danger">Danger</tailwind-chip>
        <tailwind-chip color="info">Info</tailwind-chip>
      </div>
    `
  })
};

export const NotRemovable: StoryObj<TailwindChip> = {
  name: 'Non rimovibile',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<tailwind-chip [removable]="false">Read only</tailwind-chip>`
  })
};
