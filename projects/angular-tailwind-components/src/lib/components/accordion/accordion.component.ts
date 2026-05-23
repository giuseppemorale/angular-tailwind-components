import { ChangeDetectionStrategy, Component, contentChildren } from '@angular/core';
import { TailwindAccordionItem } from './accordion-item.component';
import { TailwindComponent } from '../tailwind.component';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'tailwind-accordion',
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindAccordion extends TailwindComponent {
  readonly items = contentChildren(TailwindAccordionItem);
}
