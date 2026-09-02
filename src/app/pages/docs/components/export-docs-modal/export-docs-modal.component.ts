import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TailwindButtonModule, TailwindModalRef } from 'angular-tailwind-components';

@Component({
  selector: 'app-export-docs-modal',
  imports: [TailwindButtonModule, TranslocoPipe],
  templateUrl: './export-docs-modal.component.html'
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
