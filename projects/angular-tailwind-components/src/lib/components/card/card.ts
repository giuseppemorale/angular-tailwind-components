import { Component, input } from '@angular/core';

@Component({
  selector: 'atc-card',
  standalone: true,
  template: `
    <div
      class="bg-white rounded-xl border border-surface-200 overflow-hidden transition-shadow duration-200"
      [class.shadow-sm]="!elevated()"
      [class.shadow-lg]="elevated()"
      [class.hover:shadow-md]="hoverable() && !elevated()"
      [class.hover:shadow-xl]="hoverable() && elevated()"
    >
      <!-- Header -->
      @if (hasHeader) {
        <div
          class="px-6 py-4 border-b border-surface-100"
          [class.bg-surface-50]="headerBg()"
        >
          <ng-content select="[atcCardHeader]" />
        </div>
      }

      <!-- Image -->
      <ng-content select="[atcCardImage]" />

      <!-- Body -->
      <div [class]="bodyPadding()">
        <ng-content />
      </div>

      <!-- Footer -->
      @if (hasFooter) {
        <div class="px-6 py-4 border-t border-surface-100 bg-surface-50/50">
          <ng-content select="[atcCardFooter]" />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AtcCard {
  /** Whether the card has elevated shadow */
  elevated = input<boolean>(false);
  /** Whether to show hover shadow effect */
  hoverable = input<boolean>(false);
  /** Whether to show header background */
  headerBg = input<boolean>(false);
  /** Custom padding class for the body */
  bodyPadding = input<string>('p-6');

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
