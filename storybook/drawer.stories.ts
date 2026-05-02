import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindDrawer } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta = {
  title: 'Components/Drawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { height: '400px' },
    },
  },
};
export default meta;
type Story = StoryObj;

export const RightDrawer: Story = {
  render: () => ({
    template: `
      <div>
        <tailwind-button (click)="drawer.open()">Open Drawer</tailwind-button>
        <tailwind-drawer #drawer title="Drawer Title" position="right">
          <p class="text-sm text-surface-600 mb-4">This is the drawer content. You can place any content here.</p>
          <tailwind-input label="Name" placeholder="Enter your name" />
          <div class="mt-4 flex gap-2">
            <tailwind-button size="sm" (click)="drawer.close()">Save</tailwind-button>
            <tailwind-button size="sm" variant="ghost" (click)="drawer.close()">Cancel</tailwind-button>
          </div>
        </tailwind-drawer>
      </div>`,
  }),
};

export const WithFooter: Story = {
  render: () => ({
    template: `
      <div>
        <tailwind-button (click)="drawer.open()">Open Drawer with Footer</tailwind-button>
        <tailwind-drawer #drawer title="Edit Profile" position="right">
          <div class="space-y-4">
            <tailwind-input label="First Name" placeholder="John" />
            <tailwind-input label="Last Name" placeholder="Doe" />
            <tailwind-input label="Email" type="email" placeholder="john@example.com" />
          </div>
          <tailwind-drawer-footer>
            <div class="flex justify-end gap-3 pt-4 border-t border-surface-200">
              <tailwind-button variant="ghost" (click)="drawer.close()">Discard</tailwind-button>
              <tailwind-button (click)="drawer.close()">Save Changes</tailwind-button>
            </div>
          </tailwind-drawer-footer>
        </tailwind-drawer>
      </div>`,
  }),
};

export const LeftDrawer: Story = {
  render: () => ({
    template: `
      <div>
        <tailwind-button (click)="drawer.open()">Open Left Drawer</tailwind-button>
        <tailwind-drawer #drawer title="Navigation" position="left">
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
