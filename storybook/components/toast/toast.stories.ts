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
    <tailwind-toast [vertical]="vertical" [horizontal]="horizontal" />
    <tailwind-button color="success" (click)="showSuccess()">Success</tailwind-button>
    <tailwind-button color="warning" (click)="showWarning()">Warning</tailwind-button>
    <tailwind-button color="danger" (click)="showDanger()">Error</tailwind-button>
    <tailwind-button (click)="showInfo()">Info</tailwind-button>
    <tailwind-button color="secondary" kind="text" (click)="toastService.clear()">Clear All</tailwind-button>
  </div>`
})
class ToastStoryComponent {
  vertical: 'top' | 'bottom' = 'top';
  horizontal: 'left' | 'right' = 'right';

  readonly toastService = inject(TailwindToastService);

  showSuccess() {
    this.toastService.success('Success', 'Saved successfully!', 'check-circle');
  }
  showWarning() {
    this.toastService.warning('Warning', 'Session expires in 5 minutes.', 'exclamation-triangle');
  }
  showDanger() {
    this.toastService.danger('Error', 'Failed to save changes.', 'x-circle');
  }
  showInfo() {
    this.toastService.info('Info', 'New version available.', 'information-circle');
  }
}

const meta: Meta = {
  title: 'Components/Toast',
  component: ToastStoryComponent,
  argTypes: {
    vertical: { control: 'radio', options: ['top', 'bottom'] },
    horizontal: { control: 'radio', options: ['left', 'right'] }
  },
  args: {
    vertical: 'top',
    horizontal: 'right'
  },
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
