import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  untracked
} from '@angular/core';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindCarouselSlide } from './carousel-slide.component';

/**
 * Slideshow of projected slides, following the WAI-ARIA carousel pattern.
 * Autoplay is opt-in and pauses on hover and focus, as WCAG 2.2.2 requires.
 */
@Component({
  imports: [TailwindButton],
  selector: 'tailwind-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindCarousel extends TailwindComponent {
  private readonly labels = inject(TAILWIND_LABELS);

  /** Accessible name of the carousel region. */
  readonly ariaLabel = input<string>('');
  /** Shows the previous/next arrows. */
  readonly showArrows = input<boolean>(true);
  /** Shows the indicator dots. */
  readonly showIndicators = input<boolean>(true);
  /** Wraps around at the ends. */
  readonly loop = input<boolean>(true);
  /** Milliseconds between automatic advances; `0` disables autoplay. */
  readonly autoplayInterval = input<number>(0);

  /** Index of the visible slide. */
  readonly activeIndex = model<number>(0);

  readonly slides = contentChildren(TailwindCarouselSlide);
  readonly count = computed(() => this.slides().length);

  protected readonly previousLabel = computed(() => this.labels.previous);
  protected readonly nextLabel = computed(() => this.labels.next);
  protected readonly carouselLabel = computed(() => this.ariaLabel() || this.labels.carousel);

  readonly canGoPrevious = computed(() => this.loop() || this.activeIndex() > 0);
  readonly canGoNext = computed(() => this.loop() || this.activeIndex() < this.count() - 1);

  private timer: ReturnType<typeof setInterval> | null = null;
  /** True while the pointer or focus is inside: autoplay must not steal the slide being read. */
  private paused = false;

  constructor() {
    super();

    // Keep each slide's own visibility in step with the active index.
    effect(() => {
      const index = this.activeIndex();
      this.slides().forEach((slide, i) => slide.isActive.set(i === index));
    });

    effect(() => {
      const interval = this.autoplayInterval();
      untracked(() => this.restartAutoplay(interval));
    });

    inject(DestroyRef).onDestroy(() => this.stopAutoplay());
  }

  previous(): void {
    if (!this.canGoPrevious()) return;
    const count = this.count();
    this.activeIndex.set((this.activeIndex() - 1 + count) % count);
  }

  next(): void {
    if (!this.canGoNext()) return;
    this.activeIndex.set((this.activeIndex() + 1) % this.count());
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.count()) return;
    this.activeIndex.set(index);
  }

  indicatorLabel(index: number): string {
    return this.labels.slide.replace('{index}', String(index + 1)).replace('{total}', String(this.count()));
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  /** WCAG 2.2.2: an automatic slideshow must stop while the user is engaging with it. */
  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
  }

  private restartAutoplay(interval: number): void {
    this.stopAutoplay();
    if (interval <= 0) return;
    this.timer = setInterval(() => {
      if (!this.paused) this.next();
    }, interval);
  }

  private stopAutoplay(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
