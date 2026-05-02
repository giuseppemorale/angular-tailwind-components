import { Component, contentChildren, input } from '@angular/core';
import { AtcAccordionItem } from './accordion-item.component';

@Component({
  selector: 'atc-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AtcAccordion {
  multiple = input<boolean>(false);
  items = contentChildren(AtcAccordionItem);
}
