import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindCarousel } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindCarousel> = {
  title: 'Display/Carousel',
  component: TailwindCarousel,
  argTypes: {
    showArrows: { control: 'boolean' },
    showIndicators: { control: 'boolean' },
    loop: { control: 'boolean' },
    autoplayInterval: { control: { type: 'number', min: 0, step: 500 } }
  }
};
export default meta;

const SLIDE = (n: number, color: string) =>
  `<tailwind-carousel-slide ariaLabel="Slide ${n}">
     <div class="flex h-48 items-center justify-center ${color} text-lg font-semibold">Slide ${n}</div>
   </tailwind-carousel-slide>`;

export const Carousel: StoryObj<TailwindCarousel> = {
  parameters: { controls: { exclude: ['ariaLabel'] } },
  render: args => ({
    props: args,
    template: `
      <div class="max-w-lg">
        <tailwind-carousel
          ariaLabel="Highlights"
          [showArrows]="showArrows"
          [showIndicators]="showIndicators"
          [loop]="loop"
          [autoplayInterval]="autoplayInterval">
          ${SLIDE(1, 'bg-primary-100 text-primary-800')}
          ${SLIDE(2, 'bg-success-100 text-success-800')}
          ${SLIDE(3, 'bg-warning-100 text-warning-800')}
        </tailwind-carousel>
      </div>`
  }),
  args: { showArrows: true, showIndicators: true, loop: true, autoplayInterval: 0 }
};

export const Autoplay: StoryObj<TailwindCarousel> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="max-w-lg">
        <p class="mb-2 text-sm text-neutral-500">Advances every 3s, and pauses while hovered or focused.</p>
        <tailwind-carousel ariaLabel="Auto highlights" [autoplayInterval]="3000">
          ${SLIDE(1, 'bg-primary-100 text-primary-800')}
          ${SLIDE(2, 'bg-info-100 text-info-800')}
          ${SLIDE(3, 'bg-danger-100 text-danger-800')}
        </tailwind-carousel>
      </div>`
  })
};
