import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindIcon } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindIcon> = {
  title: 'Components/Icon',
  component: TailwindIcon,
  parameters: {
    docs: {
      description: {
        component:
          'Heroicon outline da **`public/icons/<nome>.svg`**: **`icon`** (`TailwindHeroIcon`), **`size`** `normal` (24×24) o `small` (16×16). Opzionale **`label`** per accessibilità (`alt` / non decorativa).'
      }
    }
  },
  argTypes: {
    icon: { control: 'text' },
    size: { control: 'select', options: ['normal', 'small'] },
    label: { control: 'text' }
  },
  args: {
    icon: 'bell',
    size: 'normal',
    label: undefined
  }
};
export default meta;

type Story = StoryObj<TailwindIcon>;

export const Normal: Story = {
  args: { icon: 'bell', size: 'normal' },
  render: args => ({
    props: args,
    template: `<tailwind-icon [icon]="icon" [size]="size" [label]="label" />`
  })
};

export const Small: Story = {
  args: { icon: 'bell', size: 'small' },
  render: Normal.render
};

export const WithLabel: Story = {
  args: { icon: 'arrow-right', size: 'normal', label: 'Avanti' },
  render: Normal.render
};

export const InlineRow: Story = {
  render: () => ({
    template: `
      <div class="flex items-center gap-6 text-surface-800">
        <tailwind-icon icon="home" size="normal" />
        <tailwind-icon icon="home" size="small" />
        <tailwind-icon icon="cog-6-tooth" size="small" label="Impostazioni" />
      </div>
    `
  })
};
