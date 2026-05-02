import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindCard } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCard> = {
  title: 'Components/Card',
  component: TailwindCard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindCard>;

export const Default: Story = {
  render: () => ({
    template: `
      <tailwind-card style="max-width:400px">
        <div slot="header"><h3 class="font-semibold text-surface-900">Card Title</h3></div>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div slot="footer" class="flex justify-end gap-2">
          <tailwind-button variant="ghost" size="sm">Cancel</tailwind-button>
          <tailwind-button size="sm">Confirm</tailwind-button>
        </div>
      </tailwind-card>`,
  }),
};

export const Elevated: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4">
        <tailwind-card style="max-width:300px">
          <p class="text-surface-600 text-sm">Default card</p>
        </tailwind-card>
        <tailwind-card style="max-width:300px" [elevated]="true">
          <p class="text-surface-600 text-sm">Elevated card</p>
        </tailwind-card>
        <tailwind-card style="max-width:300px" [hoverable]="true">
          <p class="text-surface-600 text-sm">Hoverable card</p>
        </tailwind-card>
      </div>`,
  }),
};
