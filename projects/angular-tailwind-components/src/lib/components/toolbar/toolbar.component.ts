import { Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class TailwindToolbar extends TailwindComponent {
  /** When true, uses rounded corners (`rounded-xl`). */
  readonly rounded = input<boolean>(true);
  /**
   * `full` / `container` sizing: horizontal uses width (`w-full` vs 95%/85%/75% + `mx-auto`);
   * vertical uses the same breakpoints on height (`h-full` vs `h-[95%] md:h-[85%] lg:h-[75%]` + `my-auto`) with `w-full` in the column.
   */
  readonly width = input<'full' | 'container'>('full');
  /** Applies a stronger drop shadow. */
  readonly elevated = input<boolean>(false);
  /** `horizontal` for a top app bar; `vertical` for a side rail (logo → content → end). */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Classes for the main content slot wrapper */
  readonly contentWrapperClasses = computed(() =>
    this.orientation() === 'horizontal' ? 'min-w-0 flex-1' : 'min-w-0 flex-1 flex flex-col min-h-0'
  );

  readonly rootClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const sizeClasses = horizontal
      ? this.width() === 'full'
        ? 'w-full'
        : 'w-[95%] md:w-[85%] lg:w-[75%] mx-auto'
      : this.width() === 'full'
        ? 'h-full w-full'
        : 'h-[95%] md:h-[85%] lg:h-[75%] my-auto w-full';

    const base = [
      'bg-white border border-surface-200',
      'flex',
      sizeClasses,
      this.rounded() ? 'rounded-xl' : 'rounded-none',
      this.elevated() ? 'shadow-lg' : 'shadow-sm'
    ];

    if (horizontal) {
      base.push('flex-row items-center gap-3 px-4 py-3');
    } else {
      base.push('flex-col items-stretch gap-3 px-3 py-4 min-h-0');
    }

    return base.join(' ');
  });
}
