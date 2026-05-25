import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindPalette } from '../../models';
import { contrastTextClass, filledBarClasses, PALETTE_ACCENT_SHADE } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTag extends TailwindComponent {
  readonly color = input<TailwindPalette>('neutral');

  readonly computedClasses = computed(() => {
    const palette = this.color();
    const shade = palette === 'amber' || palette === 'yellow' ? 500 : PALETTE_ACCENT_SHADE;
    return `inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${filledBarClasses(palette, shade)} ${contrastTextClass(palette, shade)}`;
  });
}
