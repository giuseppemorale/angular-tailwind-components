import { Component, input } from '@angular/core';

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class TailwindCard {
  /** Whether the card has elevated shadow */
  readonly elevated = input<boolean>(false);
  /** Whether to show hover shadow effect */
  readonly hoverable = input<boolean>(false);
  /** Whether to show header background */
  readonly headerBg = input<boolean>(false);
  /** Custom padding class for the body */
  readonly bodyPadding = input<string>('p-6');
  /** Whether the card has a header */
  readonly hasHeader = input<boolean>(true);
  /** Whether the card has a footer */
  readonly hasFooter = input<boolean>(true);
}
