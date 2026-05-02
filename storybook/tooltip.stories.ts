import type { Meta, StoryObj } from '@storybook/angular';
import { AtcTooltip } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcTooltip> = {
  title: 'Components/Tooltip',
  component: AtcTooltip,
  tags: ['autodocs'],
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
  },
};
export default meta;
type Story = StoryObj<AtcTooltip>;

export const AllPositions: Story = {
  render: () => ({
    template: `
      <div class="flex gap-8 items-center justify-center" style="padding:60px">
        <atc-tooltip text="Top tooltip" position="top">
          <atc-button variant="outline">Top</atc-button>
        </atc-tooltip>
        <atc-tooltip text="Bottom tooltip" position="bottom">
          <atc-button variant="outline">Bottom</atc-button>
        </atc-tooltip>
        <atc-tooltip text="Left tooltip" position="left">
          <atc-button variant="outline">Left</atc-button>
        </atc-tooltip>
        <atc-tooltip text="Right tooltip" position="right">
          <atc-button variant="outline">Right</atc-button>
        </atc-tooltip>
      </div>`,
  }),
};

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="padding:60px;display:flex;justify-content:center">
        <atc-tooltip [text]="text" [position]="position">
          <atc-button>Hover me</atc-button>
        </atc-tooltip>
      </div>`,
  }),
  args: { text: 'This is a tooltip', position: 'top' },
};
