import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

/** One slide of a `tailwind-carousel`. */
@Component({
  selector: 'tailwind-carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrl: './carousel-slide.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindCarouselSlide extends TailwindComponent {
  /** Accessible name of the slide, e.g. its headline. */
  readonly ariaLabel = input<string>('');

  /** Set by the parent carousel. */
  readonly isActive = signal(false);

  /**
   * Inactive slides stay in the DOM but are hidden from everyone — `hidden` keeps them out of the
   * accessibility tree and out of the tab order, which `opacity: 0` alone would not do.
   */
  readonly slideClasses = computed(() => this.mergeClasses('w-full', this.isActive() ? 'block' : 'hidden'));
}
