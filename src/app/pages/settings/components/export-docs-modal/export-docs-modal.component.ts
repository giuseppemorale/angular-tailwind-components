import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TailwindButton, TailwindModalRef } from 'angular-tailwind-components';

@Component({
  selector: 'app-export-docs-modal',
  imports: [TailwindButton, TranslocoPipe],
  template: `
    <h4 tailwind-modal-title>{{ 'DOCS.MODAL_TITLE' | transloco }}</h4>
    <div tailwind-modal-content>
      <p class="text-sm text-neutral-600 m-0">{{ 'DOCS.MODAL_BODY' | transloco }}</p>
    </div>
    <div tailwind-modal-footer class="flex justify-end gap-2">
      <tailwind-button color="secondary" kind="outlined" (onClick)="close()">
        {{ 'DOCS.MODAL_BTN_CLOSE' | transloco }}
      </tailwind-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportDocsModalComponent {
  private readonly modalRef = inject(TailwindModalRef<void>);

  close(): void {
    this.modalRef.close();
  }
}
