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
    kind: { control: 'select', options: ['solid', 'soft', 'outlined'] },
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

/** `soft` (default), `solid` and `outlined` — identical metrics, three levels of weight. */
export const Kinds: StoryObj<TailwindChip> = {
  name: 'Varianti',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <tailwind-chip kind="solid" color="primary">Solid</tailwind-chip>
        <tailwind-chip kind="soft" color="primary">Soft</tailwind-chip>
        <tailwind-chip kind="outlined" color="primary">Outlined</tailwind-chip>
      </div>`
  })
};
