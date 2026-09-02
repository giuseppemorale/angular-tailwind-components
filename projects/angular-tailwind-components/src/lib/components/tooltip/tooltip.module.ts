import { NgModule } from '@angular/core';
import { TailwindTooltipDirective } from '../../directives/tooltip/tooltip.directive';
import { TailwindTooltip } from './tooltip.component';

/** Tooltip directive and the surface it renders in the overlay. */
@NgModule({
  imports: [TailwindTooltipDirective, TailwindTooltip],
  exports: [TailwindTooltipDirective, TailwindTooltip]
})
export class TailwindTooltipModule {}
