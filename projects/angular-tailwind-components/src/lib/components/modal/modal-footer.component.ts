import { Component } from '@angular/core';

@Component({
  selector: 'tailwind-modal-footer',
  template: `
    <div class="px-6 py-4 border-t border-surface-100 bg-surface-50/50 rounded-b-xl">
      <ng-content />
    </div>
  `
})
export class TailwindModalFooter {}
