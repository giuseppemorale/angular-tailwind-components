import { computed, Directive, input } from '@angular/core';
import { mergeClasses as mergeClassesFn } from '../util/merge-classes';

/** Monotonic counter backing {@link TailwindComponent.elementId} when the consumer omits `id`. */
let nextUniqueId = 0;

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

  /** Fallback identity, unique per instance, used when `id` is not provided. */
  private readonly autoId = `tw-${++nextUniqueId}`;

  /**
   * Identity used to wire internal ARIA relationships (`for`, `aria-describedby`, `aria-controls`, …).
   * Consumer `id` wins; otherwise a generated one keeps label/description associations working
   * even when the consumer does not pass an `id`.
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
