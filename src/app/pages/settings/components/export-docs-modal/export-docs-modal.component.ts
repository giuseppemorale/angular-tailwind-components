import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TailwindButton, TailwindModalRef } from 'angular-tailwind-components';

@Component({
  selector: 'app-export-docs-modal',
  imports: [TailwindButton, TranslocoPipe],
  templateUrl: './export-docs-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportDocsModalComponent {
  private readonly modalRef = inject(TailwindModalRef);

  export(): void {
    this.modalRef.close(true);
  }

  close(): void {
    this.modalRef.close();
  }
}
