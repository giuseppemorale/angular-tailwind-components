import type { Meta, StoryObj } from '@storybook/angular';
import {
  TailwindToastService,
  TailwindToast,
  TailwindButton,
  TailwindPosition
} from '../../../projects/angular-tailwind-components/src/public-api';
import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';

/** Template shown in the Code panel. Do not export it: CSF would treat the string as a story. */
const TOAST_SERVICE_DEMO_TEMPLATE = `<div class="flex flex-wrap gap-3">
  <tailwind-toast [vertical]="vertical()" [horizontal]="horizontal()" />
  <tailwind-button color="success" (click)="toastService.success('Success', 'Saved successfully!', 'check-circle')">Success</tailwind-button>
  <tailwind-button color="warning" (click)="toastService.warning('Warning', 'Session expires in 5 minutes.', 'exclamation-triangle')">Warning</tailwind-button>
  <tailwind-button color="danger" (click)="toastService.danger('Error', 'Failed to save changes.', 'x-circle')">Error</tailwind-button>
  <tailwind-button (click)="toastService.info('Info', 'New version available.', 'information-circle')">Info</tailwind-button>
  <tailwind-button color="secondary" kind="text" (click)="toastService.clear()">Clear All</tailwind-button>
</div>`;

@Component({
  selector: 'tailwind-toast-story',
  imports: [TailwindToast, TailwindButton],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: TOAST_SERVICE_DEMO_TEMPLATE
})
class ToastStoryComponent {
  readonly vertical = input<Exclude<TailwindPosition, 'left' | 'right'>>('top');
  readonly horizontal = input<Exclude<TailwindPosition, 'top' | 'bottom'>>('right');

  readonly toastService = inject(TailwindToastService);
}

const meta: Meta<ToastStoryComponent> = {
  title: 'Feedback/Toast',
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
      story: { height: '300px' },
      source: {
        code: TOAST_SERVICE_DEMO_TEMPLATE.trim()
      }
    }
  }
};
export default meta;

export const ServiceBased: StoryObj<ToastStoryComponent> = {
  render: args => ({
    component: ToastStoryComponent,
    props: args
  })
};
