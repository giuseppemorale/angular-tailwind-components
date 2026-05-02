import type { Meta, StoryObj } from '@storybook/angular';
import { AtcToastService, AtcToastContainer } from '../projects/angular-tailwind-components/src/public-api';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'atc-toast-story',
  imports: [AtcToastContainer],
  template: `
    <div class="flex flex-wrap gap-3">
      <atc-button variant="success" (click)="showSuccess()">Success</atc-button>
      <atc-button variant="warning" (click)="showWarning()">Warning</atc-button>
      <atc-button variant="danger" (click)="showDanger()">Error</atc-button>
      <atc-button (click)="showInfo()">Info</atc-button>
      <atc-button variant="ghost" (click)="toast.clear()">Clear All</atc-button>
    </div>
    <atc-toast-container />`,
})
class ToastStoryComponent {
  toast = inject(AtcToastService);
  showSuccess() { this.toast.success('Saved successfully!', 'Success'); }
  showWarning() { this.toast.warning('Session expires in 5 minutes.', 'Warning'); }
  showDanger() { this.toast.danger('Failed to save changes.', 'Error'); }
  showInfo() { this.toast.info('New version available.', 'Info'); }
}

const meta: Meta = {
  title: 'Components/Toast',
  component: ToastStoryComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const ServiceBased: Story = {
  render: () => ({ component: ToastStoryComponent, props: {} }),
};
