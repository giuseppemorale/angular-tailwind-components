import { computed, Directive, input } from '@angular/core';
import { mergeClasses as mergeClassesFn } from '../util/merge-classes';
import { nextUniqueId } from '../util/unique-id';

@Directive({
  host: {
    '[attr.id]': 'id() || null'
  }
})
export abstract class TailwindComponent {
  /** Optional ID for the component */
  readonly id = input<string>();

  /**
   * Custom CSS classes applied to the component surface (see library class-forwarding convention).
   * The property is already named `class`, so no alias is needed for `class="…"` to bind to it.
   */
  readonly class = input<string>();

  /** Fallback identity, unique per instance, used when `id` is not provided. */
  private readonly autoId = nextUniqueId();

  /**
   * Identity used to wire internal ARIA relationships (`for`, `aria-describedby`, `aria-controls`, …).
   * Consumer `id` wins, so label and description associations work either way.
   */
  readonly elementId = computed(() => this.id() ?? this.autoId);

  /** `elementId()` with a suffix, e.g. `subId('inner')` → `tw-4-inner`. */
  protected subId(suffix: string): string {
    return `${this.elementId()}-${suffix}`;
  }

  /** Merges structural classes with consumer `class` (consumer classes last). */
  protected mergeClasses(...bases: (string | null | undefined)[]): string {
    return mergeClassesFn(...bases, this.class());
  }
}
