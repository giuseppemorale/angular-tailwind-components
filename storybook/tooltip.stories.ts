import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTooltip } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTooltip> = {
  title: 'Components/Tooltip',
  component: TailwindTooltip,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};
export default meta;
type Story = StoryObj<TailwindTooltip>;

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div class="flex gap-8 items-center justify-center" style="padding:60px">
        <tailwind-tooltip text="Top tooltip" position="top">
          <tailwind-button variant="outline">Top</tailwind-button>
        </tailwind-tooltip>
        <tailwind-tooltip text="Bottom tooltip" position="bottom">
          <tailwind-button variant="outline">Bottom</tailwind-button>
        </tailwind-tooltip>
        <tailwind-tooltip text="Left tooltip" position="left">
          <tailwind-button variant="outline">Left</tailwind-button>
        </tailwind-tooltip>
        <tailwind-tooltip text="Right tooltip" position="right">
          <tailwind-button variant="outline">Right</tailwind-button>
        </tailwind-tooltip>
      </div>`,
  }),
};

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:60px;display:flex;justify-content:center">
        <tailwind-tooltip [text]="text" [position]="position">
          <tailwind-button>Hover me</tailwind-button>
        </tailwind-tooltip>
      </div>`,
  }),
  args: { text: 'This is a tooltip', position: 'top' },
};
