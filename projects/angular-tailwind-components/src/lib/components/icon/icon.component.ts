import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { TailwindHeroicon, TailwindIconSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TAILWIND_ICON_BASE_PATH, TAILWIND_ICON_SIZE } from '../../tokens';
import { clampIconSize } from './util/clamp-icon-size';

@Component({
  selector: 'tailwind-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindIcon extends TailwindComponent {
  private readonly iconSize = inject(TAILWIND_ICON_SIZE, { optional: true });
  private readonly basePath = inject(TAILWIND_ICON_BASE_PATH);

  /** Heroicons outline icon name; SVG path `<TAILWIND_ICON_BASE_PATH>/<name>.svg`. */
  readonly icon = input.required<TailwindHeroicon>();
  /** Width and height in px (16–64, clamped); default from `TAILWIND_ICON_SIZE` or 24. */
  readonly size = input<TailwindIconSize>(clampIconSize(this.iconSize ?? 24));

  readonly src = computed(() => `${this.basePath.replace(/\/+$/, '')}/${this.icon()}.svg`);

  readonly pixelSize = computed(() => clampIconSize(this.size()));

  /** Consumer `class` is merged on the glyph surface. */
  readonly glyphClasses = computed(() =>
    this.mergeClasses('tailwind-icon-glyph inline-flex shrink-0 items-center justify-center')
  );

  readonly maskImage = computed(() => `url("${this.src()}")`);
}
