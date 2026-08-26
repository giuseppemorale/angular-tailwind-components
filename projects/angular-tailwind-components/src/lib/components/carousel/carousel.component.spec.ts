import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindCarousel } from './carousel.component';
import { TailwindCarouselSlide } from './carousel-slide.component';

@Component({
  imports: [TailwindCarousel, TailwindCarouselSlide],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-carousel ariaLabel="Highlights" [loop]="loop">
      <tailwind-carousel-slide ariaLabel="One">First</tailwind-carousel-slide>
      <tailwind-carousel-slide ariaLabel="Two">Second</tailwind-carousel-slide>
      <tailwind-carousel-slide ariaLabel="Three">Third</tailwind-carousel-slide>
    </tailwind-carousel>
  `
})
class CarouselHostComponent {
  readonly carousel = viewChild.required(TailwindCarousel);
  loop = true;
}

@Component({
  imports: [TailwindCarousel, TailwindCarouselSlide],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-carousel ariaLabel="Auto" [autoplayInterval]="50">
      <tailwind-carousel-slide>First</tailwind-carousel-slide>
      <tailwind-carousel-slide>Second</tailwind-carousel-slide>
    </tailwind-carousel>
  `
})
class AutoplayHostComponent {
  readonly carousel = viewChild.required(TailwindCarousel);
}

describe('TailwindCarousel', () => {
  let fixture: ComponentFixture<CarouselHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselHostComponent, AutoplayHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselHostComponent);
    fixture.detectChanges();
  });

  function slides(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="group"]'));
  }

  function indicators(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.rounded-full'));
  }

  function press(key: string): void {
    fixture.nativeElement.querySelector('section').dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  it('should expose a carousel region', () => {
    const region: HTMLElement = fixture.nativeElement.querySelector('section');
    expect(region.getAttribute('aria-label')).toBe('Highlights');
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
  });

  it('should show only the active slide and hide the rest from everyone', () => {
    const [first, second] = slides();
    expect(first.className).toContain('block');
    expect(first.getAttribute('aria-hidden')).toBeNull();

    expect(second.className).toContain('hidden');
    expect(second.getAttribute('aria-hidden')).toBe('true');
    // `hidden` alone would still leave focusable children reachable.
    expect(second.hasAttribute('inert')).toBe(true);
  });

  it('should advance and go back with the arrows', () => {
    press('ArrowRight');
    expect(fixture.componentInstance.carousel().activeIndex()).toBe(1);

    press('ArrowLeft');
    expect(fixture.componentInstance.carousel().activeIndex()).toBe(0);
  });

  it('should wrap around when looping', () => {
    press('ArrowLeft');
    expect(fixture.componentInstance.carousel().activeIndex()).toBe(2);
  });

  it('should stop at the ends when not looping', () => {
    const noLoop = TestBed.createComponent(CarouselHostComponent);
    noLoop.componentInstance.loop = false;
    noLoop.detectChanges();

    const carousel = noLoop.componentInstance.carousel();
    expect(carousel.canGoPrevious()).toBe(false);
    carousel.previous();
    expect(carousel.activeIndex()).toBe(0);
    noLoop.destroy();
  });

  it('should jump to a slide from the indicators, and mark the current one', () => {
    indicators()[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.carousel().activeIndex()).toBe(2);
    expect(indicators()[2].getAttribute('aria-current')).toBe('true');
    expect(indicators()[0].getAttribute('aria-current')).toBeNull();
  });

  it('should name each indicator with its position', () => {
    expect(indicators()[0].getAttribute('aria-label')).toBe('Slide 1 of 3');
    expect(indicators()[2].getAttribute('aria-label')).toBe('Slide 3 of 3');
  });

  // Autoplay is driven by a timer, so these two drive the clock instead of waiting on it: a
  // wall-clock test passes alone and fails under a loaded suite.
  describe('autoplay', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('should advance on its own when autoplay is on', () => {
      const auto = TestBed.createComponent(AutoplayHostComponent);
      auto.detectChanges();

      vi.advanceTimersByTime(50);
      expect(auto.componentInstance.carousel().activeIndex()).toBe(1);
      auto.destroy();
    });

    it('should hold autoplay while the pointer is inside (WCAG 2.2.2)', () => {
      const auto = TestBed.createComponent(AutoplayHostComponent);
      auto.detectChanges();

      const region: HTMLElement = auto.nativeElement.querySelector('section');
      region.dispatchEvent(new PointerEvent('pointerenter'));

      vi.advanceTimersByTime(500);
      expect(auto.componentInstance.carousel().activeIndex()).toBe(0);

      region.dispatchEvent(new PointerEvent('pointerleave'));
      vi.advanceTimersByTime(50);
      expect(auto.componentInstance.carousel().activeIndex()).toBe(1);
      auto.destroy();
    });

    it('should stop the timer once destroyed', () => {
      const auto = TestBed.createComponent(AutoplayHostComponent);
      auto.detectChanges();
      const carousel = auto.componentInstance.carousel();

      auto.destroy();
      vi.advanceTimersByTime(500);

      // A leaked interval would keep advancing a carousel nobody is looking at.
      expect(carousel.activeIndex()).toBe(0);
    });
  });
});
