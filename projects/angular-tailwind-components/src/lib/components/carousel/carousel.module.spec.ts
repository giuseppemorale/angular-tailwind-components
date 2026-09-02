import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindCarouselModule } from './carousel.module';

// Il modulo è l'unico import dell'host: se un declarable della famiglia non è esportato, il template non si applica.
@Component({
  imports: [TailwindCarouselModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-carousel>
      <tailwind-carousel-slide>One</tailwind-carousel-slide>
      <tailwind-carousel-slide>Two</tailwind-carousel-slide>
    </tailwind-carousel>
  `
})
class CarouselModuleHostComponent {}

describe('TailwindCarouselModule', () => {
  it('should expose carousel and slides to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [CarouselModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(CarouselModuleHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[aria-roledescription="carousel"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[role="group"]').length).toBe(2);
  });
});
