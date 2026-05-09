import { Component } from '@angular/core';

/** Slot marker for `TailwindCard` footer projection (`ng-content select="tailwind-card-footer"`). */
@Component({
  selector: 'tailwind-card-footer',
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`]
})
export class TailwindCardFooter {}
