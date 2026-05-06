import { Component } from '@angular/core';

/**
 * Transparent wrapper — the visual header structure is provided by TailwindModal.
 * Use inside a programmatically-opened component to supply the modal title.
 */
@Component({
  selector: 'tailwind-modal-title',
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`]
})
export class TailwindModalTitle {}
