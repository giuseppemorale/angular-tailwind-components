import { Component } from '@angular/core';

@Component({
  selector: 'tailwind-modal-content',
  template: `
    <div class="px-6 py-5">
      <ng-content />
    </div>
  `
})
export class TailwindModalContent {}
