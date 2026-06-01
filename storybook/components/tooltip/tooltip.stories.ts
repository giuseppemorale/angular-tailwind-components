import type { Meta, StoryObj } from '@storybook/angular';
import {
  TailwindButton,
  TailwindInput,
  TailwindTooltipDirective
} from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTooltipDirective> = {
  title: 'Overlay/Tooltip',
  component: TailwindTooltipDirective,
  argTypes: {
    tooltip: { control: 'text' },
    tooltipPosition: { control: 'select', options: ['top', 'bottom', 'left', 'right'] }
  }
};
export default meta;

export const ButtonTooltip: StoryObj<TailwindTooltipDirective> = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [TailwindTooltipDirective, TailwindButton]
    },
    template: `
      <div class="flex justify-center" style="padding: 60px;">
        <tailwind-button [tooltip]="tooltip" [tooltipPosition]="tooltipPosition">Hover me</tailwind-button>
      </div>`
  }),
  args: { tooltip: 'This is a tooltip', tooltipPosition: 'top' }
};

export const InputTooltip: StoryObj<TailwindTooltipDirective> = {
  render: args => ({
    props: args,
    moduleMetadata: {
      imports: [TailwindTooltipDirective, TailwindInput]
    },
    template: `
      <div class="flex justify-center" style="padding: 60px;">
        <tailwind-input label="Tooltip" type="text" placeholder="Type something..." [tooltip]="tooltip" [tooltipPosition]="tooltipPosition" />
      </div>`
  }),
  args: { tooltip: 'This is a tooltip', tooltipPosition: 'top' }
};
