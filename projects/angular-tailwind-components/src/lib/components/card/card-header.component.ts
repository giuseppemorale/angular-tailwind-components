import { Component } from '@angular/core';

/** Slot marker for `TailwindCard` header projection (`ng-content select="tailwind-card-header"`). */
@Component({
  selector: 'tailwind-card-header',
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`]
})
export class TailwindCardHeader {}
