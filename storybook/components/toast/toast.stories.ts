import type { Meta, StoryObj } from '@storybook/angular';
import {
  TailwindToastService,
  TailwindToast,
  TailwindButton
} from '../../../projects/angular-tailwind-components/src/public-api';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'tailwind-toast-story',
  imports: [TailwindToast, TailwindButton],
  template: ` <div class="flex flex-wrap gap-3">
      <tailwind-button color="success" (click)="showSuccess()">Success</tailwind-button>
      <tailwind-button color="warning" (click)="showWarning()">Warning</tailwind-button>
      <tailwind-button color="danger" (click)="showDanger()">Error</tailwind-button>
      <tailwind-button (click)="showInfo()">Info</tailwind-button>
      <tailwind-button color="secondary" kind="text" (click)="toast.clear()">Clear All</tailwind-button>
    </div>
    <tailwind-toast />`
})
class ToastStoryComponent {
  toast = inject(TailwindToastService);
  showSuccess() {
    this.toast.success('Saved successfully!', 'Success');
  }
  showWarning() {
    this.toast.warning('Session expires in 5 minutes.', 'Warning');
  }
  showDanger() {
    this.toast.danger('Failed to save changes.', 'Error');
  }
  showInfo() {
    this.toast.info('New version available.', 'Info');
  }
}

const meta: Meta = {
  title: 'Components/Toast',
  component: ToastStoryComponent,
  parameters: {
    docs: {
      story: { height: '300px' }
    }
  }
};
export default meta;
type Story = StoryObj;

export const ServiceBased: Story = {
  render: args => ({ component: ToastStoryComponent, props: args })
};
