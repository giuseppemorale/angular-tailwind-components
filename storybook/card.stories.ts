import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindCard } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCard> = {
  title: 'Components/Card',
  component: TailwindCard,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<TailwindCard>;

export const Default: Story = {
  render: () => ({
    template: `
      <tailwind-card style="max-width:400px">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button variant="ghost" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};

export const NoHeader: Story = {
  render: () => ({
    template: `
      <tailwind-card style="max-width:400px" [hasHeader]="false">
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button variant="ghost" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};

export const NoFooter: Story = {
  render: () => ({
    template: `
      <tailwind-card style="max-width:400px" [hasFooter]="false">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
      </tailwind-card>`
  })
};

export const Elevated: Story = {
  render: () => ({
    template: `
      <tailwind-card style="max-width:400px" [elevated]="true">
        <tailwind-card-header><h3 class="font-semibold text-surface-900">Card Title</h3></tailwind-card-header>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <tailwind-card-footer>
          <div class="flex justify-end gap-2">
            <tailwind-button variant="ghost" size="sm">Cancel</tailwind-button>
            <tailwind-button size="sm">Confirm</tailwind-button>
          </div>
        </tailwind-card-footer>
      </tailwind-card>`
  })
};
