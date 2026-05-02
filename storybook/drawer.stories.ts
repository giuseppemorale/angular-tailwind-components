import type { Meta, StoryObj } from '@storybook/angular';
import { AtcDrawer } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const RightDrawer: Story = {
  render: () => ({
    props: { open: false },
    template: `
      <div>
        <atc-button (click)="open = true">Open Drawer</atc-button>
        <atc-drawer [(open)]="open" title="Drawer Title" position="right">
          <p class="text-sm text-surface-600 mb-4">This is the drawer content. You can place any content here.</p>
          <atc-input label="Name" placeholder="Enter your name" />
          <div class="mt-4 flex gap-2">
            <atc-button size="sm" (click)="open = false">Save</atc-button>
            <atc-button size="sm" variant="ghost" (click)="open = false">Cancel</atc-button>
          </div>
        </atc-drawer>
      </div>`,
  }),
};

export const LeftDrawer: Story = {
  render: () => ({
    props: { open: false },
    template: `
      <div>
        <atc-button (click)="open = true">Open Left Drawer</atc-button>
        <atc-drawer [(open)]="open" title="Navigation" position="left">
          <nav class="space-y-2">
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Dashboard</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Products</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Orders</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Settings</a>
          </nav>
        </atc-drawer>
      </div>`,
  }),
};
