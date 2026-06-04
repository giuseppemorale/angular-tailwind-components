import { Directive, input } from '@angular/core';
import { mergeClasses as mergeClassesFn } from '../util/merge-classes';

@Directive({
  host: {
    '[attr.id]': 'id() || null'
  }
})
export abstract class TailwindComponent {
  /** Optional ID for the component */
  readonly id = input<string>();

  /** Custom CSS classes applied to the component surface (see library class-forwarding convention). */
  readonly class = input<string>(undefined, { alias: 'class' });

  /** Merges structural classes with consumer `class` (consumer classes last). */
  protected mergeClasses(...bases: (string | null | undefined)[]): string {
    return mergeClassesFn(...bases, this.class());
  }
}
