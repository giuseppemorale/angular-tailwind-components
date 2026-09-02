import { NgModule } from '@angular/core';
import { TailwindAccordion } from './accordion.component';
import { TailwindAccordionItem } from './accordion-item.component';

/** Accordion and its items. */
@NgModule({
  imports: [TailwindAccordion, TailwindAccordionItem],
  exports: [TailwindAccordion, TailwindAccordionItem]
})
export class TailwindAccordionModule {}
