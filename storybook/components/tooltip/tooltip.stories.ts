import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTooltipDirective } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTooltipDirective> = {
  title: 'Components/Tooltip',
  component: TailwindTooltipDirective,
  tags: ['autodocs'],
  argTypes: {
    tooltipPosition: { control: 'select', options: ['top', 'bottom', 'left', 'right'] }
  }
};
export default meta;

export const ButtonTooltip: StoryObj<TailwindTooltipDirective> = {
  render: args => ({
    props: args,
    template: `
      <div class="flex justify-center" style="padding: 60px;">
        <tailwind-button [tooltip]="text" [tooltipPosition]="tooltipPosition">Hover me</tailwind-button>
      </div>`
  }),
  args: { text: 'This is a tooltip', tooltipPosition: 'top' }
};

export const InputTooltip: StoryObj<TailwindTooltipDirective> = {
  render: args => ({
    props: args,
    template: `
      <div class="flex justify-center" style="padding: 60px;">
        <tailwind-input label="Tooltip" type="text" placeholder="Type something..." [tooltip]="text" [tooltipPosition]="tooltipPosition" />
      </div>`
  }),
  args: { text: 'This is a tooltip', tooltipPosition: 'top' }
};
