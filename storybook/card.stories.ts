import type { Meta, StoryObj } from '@storybook/angular';
import { AtcCard } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcCard> = {
  title: 'Components/Card',
  component: AtcCard,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcCard>;

export const Default: Story = {
  render: () => ({
    template: `
      <atc-card style="max-width:400px">
        <div slot="header"><h3 class="font-semibold text-surface-900">Card Title</h3></div>
        <p class="text-surface-600 text-sm">This is the card body content. It can contain any HTML.</p>
        <div slot="footer" class="flex justify-end gap-2">
          <atc-button variant="ghost" size="sm">Cancel</atc-button>
          <atc-button size="sm">Confirm</atc-button>
        </div>
      </atc-card>`,
  }),
};

export const Elevated: Story = {
  render: () => ({
    template: `
      <div class="flex gap-4">
        <atc-card style="max-width:300px">
          <p class="text-surface-600 text-sm">Default card</p>
        </atc-card>
        <atc-card style="max-width:300px" [elevated]="true">
          <p class="text-surface-600 text-sm">Elevated card</p>
        </atc-card>
        <atc-card style="max-width:300px" [hoverable]="true">
          <p class="text-surface-600 text-sm">Hoverable card</p>
        </atc-card>
      </div>`,
  }),
};
