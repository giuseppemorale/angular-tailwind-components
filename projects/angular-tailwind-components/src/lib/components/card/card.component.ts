import { Component, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { TailwindCardHeader } from './card-header.component';
import { TailwindCardFooter } from './card-footer.component';
import { TailwindCardImage } from './card-image.component';
export { TailwindCardHeader, TailwindCardFooter, TailwindCardImage };

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class TailwindCard extends TailwindComponent {
  /** Whether the card has elevated shadow */
  readonly elevated = input<boolean>(false);
  /** Whether to show hover shadow effect */
  readonly hoverable = input<boolean>(false);
  /** Whether to show header background */
  readonly headerBg = input<boolean>(false);
  /** Whether the card has a header */
  readonly hasHeader = input<boolean>(true);
  /** Whether the card has a footer */
  readonly hasFooter = input<boolean>(true);
}
