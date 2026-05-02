import { Directive, input } from '@angular/core';

@Directive({
  host: {
    '[attr.id]': 'id() || null',
    '[class]': 'class() || null'
  }
})
export abstract class TailwindComponent {
  /** Optional ID for the component */
  readonly id = input<string>();

  /** Custom CSS classes to append */
  readonly class = input<string>(undefined, { alias: 'class' });
}
