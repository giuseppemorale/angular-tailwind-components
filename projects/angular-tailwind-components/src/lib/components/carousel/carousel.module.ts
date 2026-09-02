import { NgModule } from '@angular/core';
import { TailwindCarousel } from './carousel.component';
import { TailwindCarouselSlide } from './carousel-slide.component';

/** Carousel and its slides. */
@NgModule({
  imports: [TailwindCarousel, TailwindCarouselSlide],
  exports: [TailwindCarousel, TailwindCarouselSlide]
})
export class TailwindCarouselModule {}
