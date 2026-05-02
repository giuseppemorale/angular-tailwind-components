import type { Meta, StoryObj } from '@storybook/angular';
import {
  TailwindModalService,
  TailwindModalContainer,
  TailwindButton
} from '../projects/angular-tailwind-components/src/public-api';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'tailwind-modal-story',
  imports: [TailwindModalContainer, TailwindButton],
  template: ` <div class="flex flex-wrap gap-3">
      <tailwind-button (click)="openSimple()">Simple Modal</tailwind-button>
      <tailwind-button variant="danger" (click)="openConfirm()">Confirm Dialog</tailwind-button>
      <tailwind-button variant="outline" (click)="openLarge()">Large Modal</tailwind-button>
    </div>
    <p class="mt-4 text-sm text-surface-600">
      Last result: <strong>{{ result }}</strong>
    </p>
    <tailwind-modal-container />`
})
class ModalStoryComponent {
  modal = inject(TailwindModalService);
  result = 'none';

  async openSimple() {
    await this.modal.open({
      title: 'About This Component',
      message:
        'This modal was opened programmatically via TailwindModalService. Close it with the X button or click outside.',
      showCloseButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true
    });
    this.result = 'dismissed';
  }

  async openConfirm() {
    const confirmed = await this.modal.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    });
    this.result = confirmed ? 'confirmed ✓' : 'cancelled ✗';
  }

  async openLarge() {
    const res = await this.modal.open<boolean>({
      title: 'Large Modal',
      size: 'lg',
      message: 'This is a large modal with more space for complex content.',
      confirmLabel: 'Accept',
      cancelLabel: 'Decline',
      showCloseButton: true,
      closeOnBackdrop: false
    });
    this.result = res ? 'accepted' : 'declined';
  }
}

const meta: Meta = {
  title: 'Components/Modal',
  component: ModalStoryComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: { height: '400px' }
    }
  }
};
export default meta;
type Story = StoryObj;

export const ServiceBased: Story = {
  render: (args) => ({ component: ModalStoryComponent, props: args })
};
