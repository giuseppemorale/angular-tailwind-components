import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindCard } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCard> = {
  title: 'Components/Card',
  component: TailwindCard,
  args: {
    elevated: false,
    hoverable: false,
    headerBg: false,
    hasHeader: true,
    hasFooter: true
  }
};
export default meta;

export const Card: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};

export const NoHeader: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [hasHeader]="false">
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};

export const NoFooter: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [hasFooter]="false">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
      </tailwind-card>`
  })
};

export const Elevated: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [elevated]="true">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};
