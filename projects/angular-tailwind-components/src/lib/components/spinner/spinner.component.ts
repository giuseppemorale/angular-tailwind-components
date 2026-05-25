import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindPalette, TailwindSize } from '../../models';
import { textAccentClasses } from '../../utils/palette.util';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindSpinner extends TailwindComponent {
  readonly size = input<TailwindSize>('md');
  readonly color = input<TailwindPalette>('neutral');
  readonly label = input<string>('');
  readonly ariaLabel = input<string>('Loading');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly containerClasses = computed(() => {
    const base = 'inline-flex items-center gap-2';
    const orient = this.orientation() === 'vertical' ? 'flex-col' : '';
    return `${base} ${orient}`;
  });

  readonly iconPixelSize = computed(() => {
    const sizeMap: Record<TailwindSize, number> = {
      xs: 16,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48
    };
    return sizeMap[this.size()];
  });

  readonly iconClasses = computed(() => `animate-spin ${textAccentClasses(this.color())}`);

  readonly labelClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs',
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    return `${sizeMap[this.size()]} ${textAccentClasses(this.color())} font-medium`;
  });
}
