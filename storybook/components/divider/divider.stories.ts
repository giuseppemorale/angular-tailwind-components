import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDivider } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindDivider> = {
  title: 'Components/Divider',
  component: TailwindDivider,
  parameters: {
    docs: {
      description: {
        component:
          'Visual separator: horizontal rule, vertical rule in flex layouts, solid or dashed border, optional **label** (horizontal), and **inset** horizontal margins.'
      }
    }
  },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    inset: { control: 'boolean' },
    variant: { control: 'select', options: ['solid', 'dashed'] },
    label: { control: 'text' }
  },
  args: {
    orientation: 'horizontal',
    inset: false,
    variant: 'solid',
    label: ''
  }
};
export default meta;

type Story = StoryObj<TailwindDivider>;

export const Horizontal: Story = {
  render: args => ({
    props: args,
    template: `
      <div class="max-w-md space-y-4 text-sm text-neutral-700">
        <p>Section A</p>
        <tailwind-divider [orientation]="orientation" [inset]="inset" [variant]="variant" [label]="label" />
        <p>Section B</p>
      </div>
    `
  })
};

export const WithLabel: Story = {
  args: { label: 'OR', variant: 'solid' },
  render: Horizontal.render
};

export const VerticalInFlex: Story = {
  args: { orientation: 'vertical' },
  render: args => ({
    props: args,
    template: `
      <div class="flex h-32 items-stretch gap-4">
        <span class="text-sm">Left</span>
        <tailwind-divider [orientation]="orientation" [variant]="variant" />
        <span class="text-sm">Right</span>
      </div>
    `
  })
};
