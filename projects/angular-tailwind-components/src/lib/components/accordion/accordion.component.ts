import { Component, contentChildren, input } from '@angular/core';
import { TailwindAccordionItem } from './accordion-item.component';

@Component({
  selector: 'tailwind-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class TailwindAccordion {
  readonly multiple = input<boolean>(false);
  items = contentChildren(TailwindAccordionItem);
}
