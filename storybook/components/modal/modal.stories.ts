import { Component, inject, input, signal } from '@angular/core';
import { argsToTemplate, moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  TailwindButton,
  TailwindModal,
  TailwindModalRef,
  TailwindModalService,
  TailwindSize
} from '../../../projects/angular-tailwind-components/src/public-api';

@Component({
  imports: [TailwindButton],
  selector: 'modal-story-confirm',
  template: `
    <h4 tailwind-modal-title>Confirm action</h4>
    <div tailwind-modal-content>
      <p class="text-neutral-700">This action cannot be undone. Do you want to proceed?</p>
    </div>
    <div tailwind-modal-footer class="flex justify-end gap-3">
      <tailwind-button color="secondary" kind="outlined" (click)="ref.close()">Cancel</tailwind-button>
      <tailwind-button color="primary" (click)="ref.close(true)">Confirm</tailwind-button>
    </div>
  `
})
class ConfirmModalComponent {
  readonly ref = inject<TailwindModalRef<boolean>>(TailwindModalRef);
}

@Component({
  imports: [TailwindButton],
  selector: 'modal-story-programmatic-wrapper',
  template: `
    <div class="flex items-center gap-6">
      <tailwind-button (click)="open()">Open confirmation modal</tailwind-button>
      @if (resolved()) {
        <p class="text-sm text-neutral-600">
          Result:
          <strong [class]="confirmed() ? 'text-success-600' : 'text-neutral-400'">
            {{ confirmed() ? 'Confirmed ✓' : 'Dismissed' }}
          </strong>
        </p>
      }
    </div>
  `
})
class ProgrammaticWrapperComponent {
  private readonly tailwindModalService = inject(TailwindModalService);

  readonly size = input<TailwindSize>('md');

  readonly showCloseButton = input<boolean>(true);

  readonly closeOnBackdrop = input<boolean>(true);

  readonly closeOnEscape = input<boolean>(true);

  readonly resolved = signal(false);

  readonly confirmed = signal(false);

  async open(): Promise<void> {
    const result = await this.tailwindModalService.open<boolean>(ConfirmModalComponent, {
      size: this.size(),
      showCloseButton: this.showCloseButton(),
      closeOnBackdrop: this.closeOnBackdrop(),
      closeOnEscape: this.closeOnEscape()
    });
    this.resolved.set(true);
    this.confirmed.set(result === true);
  }
}

const meta: Meta<TailwindModal> = {
  title: 'Components/Modal',
  component: TailwindModal,
  parameters: {
    docs: {
      story: { height: '400px' }
    }
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    showCloseButton: { control: 'boolean' },
    closeOnBackdrop: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' }
  }
};

export default meta;

/** Declarative usage: same pattern as Drawer — `meta.component` matches what Canvas renders, controls bind to `tailwind-modal`. */

export const SimpleModal: StoryObj<TailwindModal> = {
  render: args => ({
    props: args,
    template: `
      <div class="flex flex-col gap-4">
        <tailwind-button (click)="modal.open()">Open modal</tailwind-button>
        <tailwind-modal #modal ${argsToTemplate(args)}>
          <h4 tailwind-modal-title>Confirm action</h4>
          <div tailwind-modal-content>
            <p class="text-neutral-700">This action cannot be undone. Do you want to proceed?</p>
          </div>
          <div tailwind-modal-footer class="flex justify-end gap-3">
            <tailwind-button color="secondary" kind="outlined" (click)="modal.close()">Cancel</tailwind-button>
            <tailwind-button color="primary" (click)="modal.close()">Confirm</tailwind-button>
          </div>
        </tailwind-modal>
      </div>
    `
  }),
  args: {
    size: 'md',
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEscape: true
  }
};

/** Opens via `TailwindModalService.open()` and projects slot markup from a dedicated component (append-to-body). */

export const ProgrammaticOpen: StoryObj<TailwindModal> = {
  render: args => ({
    props: args,
    template: `<modal-story-programmatic-wrapper ${argsToTemplate(args)}></modal-story-programmatic-wrapper>`
  }),
  decorators: [
    moduleMetadata({
      imports: [ProgrammaticWrapperComponent]
    })
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Call `modalService.open<R, D>(Component, config)` and await the `Promise<R | undefined>`. ' +
          'The inner component injects `TailwindModalRef<R>` to resolve the promise. ' +
          'The `D` type is the data passed to the modal.'
      },
      source: {
        language: 'typescript',
        code: `
          /* HTML */
          <tailwind-button (click)="open()">Open confirmation modal</tailwind-button>
          /* TypeScript */
          async openModal(): void {
            const result = await this.modalService.open<boolean>(ConfirmModalComponent, {
              size: 'md',
              showCloseButton: true,
              closeOnBackdrop: true,
              closeOnEscape: true
            });
            if (result) {
              // utente ha confermato
            }
          }`.trim()
      }
    }
  },
  args: {
    size: 'md',
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEscape: true
  }
};
