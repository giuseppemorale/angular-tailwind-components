import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindTag } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Display/Tag',
  component: TailwindTag,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    },
    kind: { control: 'select', options: ['solid', 'soft', 'outlined'] }
  }
};
export default meta;

export const Tags: StoryObj<TailwindTag> = {
  render: args => ({
    props: args,
    template: `<tailwind-tag ${argsToTemplate(args)}>${args.color}</tailwind-tag>`
  }),
  args: {
    color: 'secondary'
  }
};

/** `solid` (default), `soft` and `outlined` — the same triad shared with badge, chip and alert. */
export const Kinds: StoryObj<TailwindTag> = {
  name: 'Varianti',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <tailwind-tag kind="solid" color="danger">Solid</tailwind-tag>
        <tailwind-tag kind="soft" color="danger">Soft</tailwind-tag>
        <tailwind-tag kind="outlined" color="danger">Outlined</tailwind-tag>
      </div>`
  })
};
