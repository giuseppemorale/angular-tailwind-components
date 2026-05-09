import { Component } from '@angular/core';

/** Slot marker for `TailwindCard` image projection (`ng-content select="tailwind-card-image"`). */
@Component({
  selector: 'tailwind-card-image',
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`]
})
export class TailwindCardImage {}
