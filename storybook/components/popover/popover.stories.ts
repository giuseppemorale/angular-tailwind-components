import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindPopover } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindPopover> = {
  title: 'Overlay/Popover',
  component: TailwindPopover,
  argTypes: {
    position: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    title: { control: 'text' },
    showCloseButton: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' }
  }
};
export default meta;

export const Popover: StoryObj<TailwindPopover> = {
  parameters: { controls: { exclude: ['ariaLabel'] } },
  render: args => ({
    props: args,
    template: `
      <div class="flex justify-center py-16">
        <tailwind-button #trigger (click)="pop.toggle($event)">Show details</tailwind-button>
        <tailwind-popover
          #pop
          [position]="position"
          [title]="title"
          [showCloseButton]="showCloseButton"
          [closeOnEscape]="closeOnEscape"
          [closeOnOutsideClick]="closeOnOutsideClick">
          <p>Anything can go in here — text, form fields, a small list.</p>
        </tailwind-popover>
      </div>`
  }),
  args: { position: 'bottom', title: 'Details', showCloseButton: true, closeOnEscape: true, closeOnOutsideClick: true }
};

export const Positions: StoryObj<TailwindPopover> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap justify-center gap-6 py-24">
        <tailwind-button (click)="top.toggle($event)">Top</tailwind-button>
        <tailwind-popover #top position="top"><p>Above the trigger</p></tailwind-popover>

        <tailwind-button (click)="bottom.toggle($event)">Bottom</tailwind-button>
        <tailwind-popover #bottom position="bottom"><p>Below the trigger</p></tailwind-popover>

        <tailwind-button (click)="left.toggle($event)">Left</tailwind-button>
        <tailwind-popover #left position="left"><p>Beside it</p></tailwind-popover>

        <tailwind-button (click)="right.toggle($event)">Right</tailwind-button>
        <tailwind-popover #right position="right"><p>Beside it</p></tailwind-popover>
      </div>`
  })
};
