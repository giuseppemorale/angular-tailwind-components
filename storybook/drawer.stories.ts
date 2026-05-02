import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDrawer } from '../projects/angular-tailwind-components/src/public-api';

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
        <tailwind-button (click)="open = true">Open Drawer</tailwind-button>
        <tailwind-drawer [(open)]="open" title="Drawer Title" position="right">
          <p class="text-sm text-surface-600 mb-4">This is the drawer content. You can place any content here.</p>
          <tailwind-input label="Name" placeholder="Enter your name" />
          <div class="mt-4 flex gap-2">
            <tailwind-button size="sm" (click)="open = false">Save</tailwind-button>
            <tailwind-button size="sm" variant="ghost" (click)="open = false">Cancel</tailwind-button>
          </div>
        </tailwind-drawer>
      </div>`,
  }),
};

export const LeftDrawer: Story = {
  render: () => ({
    props: { open: false },
    template: `
      <div>
        <tailwind-button (click)="open = true">Open Left Drawer</tailwind-button>
        <tailwind-drawer [(open)]="open" title="Navigation" position="left">
          <nav class="space-y-2">
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Dashboard</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Products</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Orders</a>
            <a href="#" class="block px-3 py-2 rounded-lg text-sm hover:bg-surface-100">Settings</a>
          </nav>
        </tailwind-drawer>
      </div>`,
  }),
};
