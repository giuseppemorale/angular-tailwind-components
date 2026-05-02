import type { Meta, StoryObj } from '@storybook/angular';
import { AtcModalService, AtcModalContainer } from '../projects/angular-tailwind-components/src/public-api';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'atc-modal-story',
  imports: [AtcModalContainer],
  template: `
    <div class="flex flex-wrap gap-3">
      <atc-button (click)="openSimple()">Simple Modal</atc-button>
      <atc-button variant="danger" (click)="openConfirm()">Confirm Dialog</atc-button>
      <atc-button variant="outline" (click)="openLarge()">Large Modal</atc-button>
    </div>
    <p class="mt-4 text-sm text-surface-600">Last result: <strong>{{ result }}</strong></p>
    <atc-modal-container />`,
})
class ModalStoryComponent {
  modal = inject(AtcModalService);
  result = 'none';

  async openSimple() {
    await this.modal.open({
      title: 'About This Component',
      message: 'This modal was opened programmatically via AtcModalService. Close it with the X button or click outside.',
      showCloseButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
    });
    this.result = 'dismissed';
  }

  async openConfirm() {
    const confirmed = await this.modal.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    this.result = confirmed ? 'confirmed âœ“' : 'cancelled âœ—';
  }

  async openLarge() {
    const res = await this.modal.open<boolean>({
      title: 'Large Modal',
      size: 'lg',
      message: 'This is a large modal with more space for complex content.',
      confirmLabel: 'Accept',
      cancelLabel: 'Decline',
      showCloseButton: true,
      closeOnBackdrop: false,
    });
    this.result = res ? 'accepted' : 'declined';
  }
}

const meta: Meta = {
  title: 'Components/Modal',
  component: ModalStoryComponent,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const ServiceBased: Story = {
  render: () => ({ component: ModalStoryComponent, props: {} }),
};
