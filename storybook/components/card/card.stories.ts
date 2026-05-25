import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import {
  TailwindButton,
  TailwindCard,
  TailwindTitle
} from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCard> = {
  title: 'Components/Card',
  component: TailwindCard,
  decorators: [
    moduleMetadata({
      imports: [TailwindCard, TailwindTitle, TailwindButton]
    })
  ]
};
export default meta;

export const Card: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px">
        <tailwind-title tailwind-card-header titleTag="h3" text="Card Title" />
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div tailwind-card-footer class="flex justify-end gap-2">
          <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
          <tailwind-button size="sm">Confirm</tailwind-button>
        </div>
      </tailwind-card>`
  }),
  args: {
    elevated: false,
    hoverable: false,
    headerBg: false,
    hasHeader: true,
    hasFooter: true
  }
};

export const NoHeader: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [hasHeader]="false">
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div tailwind-card-footer class="flex justify-end gap-2">
          <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
          <tailwind-button size="sm">Confirm</tailwind-button>
        </div>
      </tailwind-card>`
  }),
  args: {
    elevated: false,
    hoverable: false,
    headerBg: false,
    hasHeader: false,
    hasFooter: true
  }
};

export const NoFooter: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [hasFooter]="false">
        <tailwind-title tailwind-card-header titleTag="h3" text="Card Title" />
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
      </tailwind-card>`
  }),
  args: {
    elevated: false,
    hoverable: false,
    headerBg: false,
    hasHeader: true,
    hasFooter: false
  }
};

export const Elevated: StoryObj<TailwindCard> = {
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [elevated]="true">
        <tailwind-title tailwind-card-header titleTag="h3" text="Card Title" />
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div tailwind-card-footer class="flex justify-end gap-2">
          <tailwind-button color="secondary" kind="text" size="sm">Cancel</tailwind-button>
          <tailwind-button size="sm">Confirm</tailwind-button>
        </div>
      </tailwind-card>`
  }),
  args: {
    elevated: true,
    hoverable: false,
    headerBg: false,
    hasHeader: true,
    hasFooter: true
  }
};
