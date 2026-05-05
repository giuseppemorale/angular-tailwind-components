import { Component, contentChildren } from '@angular/core';
import { TailwindAccordionItem } from './accordion-item.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class TailwindAccordion extends TailwindComponent {
  readonly items = contentChildren(TailwindAccordionItem);
}
