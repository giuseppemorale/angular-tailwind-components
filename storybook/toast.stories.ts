import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindToastService, TailwindToastContainer, TailwindButton } from '../projects/angular-tailwind-components/src/public-api';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'tailwind-toast-story',
  imports: [TailwindToastContainer, TailwindButton],
  template: `
    <div class="flex flex-wrap gap-3">
      <tailwind-button variant="success" (click)="showSuccess()">Success</tailwind-button>
      <tailwind-button variant="warning" (click)="showWarning()">Warning</tailwind-button>
      <tailwind-button variant="danger" (click)="showDanger()">Error</tailwind-button>
      <tailwind-button (click)="showInfo()">Info</tailwind-button>
      <tailwind-button variant="ghost" (click)="toast.clear()">Clear All</tailwind-button>
    </div>
    <tailwind-toast-container />`,
})
class ToastStoryComponent {
  toast = inject(TailwindToastService);
  showSuccess() { this.toast.success('Saved successfully!', 'Success'); }
  showWarning() { this.toast.warning('Session expires in 5 minutes.', 'Warning'); }
  showDanger() { this.toast.danger('Failed to save changes.', 'Error'); }
  showInfo() { this.toast.info('New version available.', 'Info'); }
}

const meta: Meta = {
  title: 'Components/Toast',
  component: ToastStoryComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { height: '300px' },
    },
  },
};
export default meta;
type Story = StoryObj;

export const ServiceBased: Story = {
  render: () => ({ component: ToastStoryComponent, props: {} }),
};
