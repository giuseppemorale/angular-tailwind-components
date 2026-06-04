import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate, moduleMetadata } from '@storybook/angular';
import {
  TailwindButton,
  TailwindCard,
  TailwindTitle
} from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCard> = {
  title: 'Display/Card',
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
          <tailwind-button color="secondary" kind="text">Cancel</tailwind-button>
          <tailwind-button>Confirm</tailwind-button>
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
  parameters: { controls: { exclude: ['hasHeader', 'headerBg'] } },
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [hasHeader]="false">
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div tailwind-card-footer class="flex justify-end gap-2">
          <tailwind-button color="secondary" kind="text">Cancel</tailwind-button>
          <tailwind-button>Confirm</tailwind-button>
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
  parameters: { controls: { exclude: ['hasFooter', 'headerBg'] } },
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

export const InGrid: StoryObj<TailwindCard> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <tailwind-card class="h-full" [hasFooter]="false">
          <div tailwind-card-header class="text-center">
            <span class="inline-flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">1</span>
            <h3 class="mt-3 font-semibold text-neutral-900">Alpha</h3>
          </div>
          <p class="text-sm text-neutral-600 text-center m-0">Short placeholder copy.</p>
        </tailwind-card>
        <tailwind-card class="h-full" [hasFooter]="false">
          <div tailwind-card-header class="text-center">
            <span class="inline-flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">2</span>
            <h3 class="mt-3 font-semibold text-neutral-900">Beta</h3>
          </div>
          <p class="text-sm text-neutral-600 text-center m-0">
            Medium length filler text to show how cards stretch when content height differs across columns.
          </p>
        </tailwind-card>
        <tailwind-card class="h-full" [hasFooter]="false">
          <div tailwind-card-header class="text-center">
            <span class="inline-flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">3</span>
            <h3 class="mt-3 font-semibold text-neutral-900">Gamma</h3>
          </div>
          <p class="text-sm text-neutral-600 text-center m-0">Another brief block of sample text.</p>
        </tailwind-card>
        <tailwind-card class="h-full" [hasFooter]="false">
          <div tailwind-card-header class="text-center">
            <span class="inline-flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">4</span>
            <h3 class="mt-3 font-semibold text-neutral-900">Delta</h3>
          </div>
          <p class="text-sm text-neutral-600 text-center m-0">Neutral demo content for layout only.</p>
        </tailwind-card>
        <tailwind-card class="h-full" [hasFooter]="false">
          <div tailwind-card-header class="text-center">
            <span class="inline-flex size-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">5</span>
            <h3 class="mt-3 font-semibold text-neutral-900">Epsilon</h3>
          </div>
          <p class="text-sm text-neutral-600 text-center m-0">
            Longer fake paragraph: lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </tailwind-card>
      </div>`
  })
};

export const Elevated: StoryObj<TailwindCard> = {
  parameters: { controls: { exclude: ['elevated'] } },
  render: args => ({
    props: args,
    template: `
      <tailwind-card ${argsToTemplate(args)} style="max-width:400px" [elevated]="true">
        <tailwind-title tailwind-card-header titleTag="h3" text="Card Title" />
        <p class="text-neutral-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div tailwind-card-footer class="flex justify-end gap-2">
          <tailwind-button color="secondary" kind="text">Cancel</tailwind-button>
          <tailwind-button>Confirm</tailwind-button>
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
