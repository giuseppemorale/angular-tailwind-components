import { Component, input } from '@angular/core';

@Component({
  selector: 'tailwind-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
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

  /** Track content projection slots */
  hasHeader = false;
  hasFooter = false;

  ngAfterContentInit(): void {
    // Content projection slots are determined by the template
    // They will render if content is projected into them
    this.hasHeader = true;
    this.hasFooter = true;
  }
}
