import { Component, computed, inject, input } from '@angular/core';
import type { TailwindHeroIcon, TailwindIconSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TAILWIND_ICON_SIZE } from '../../tokens';

@Component({
  selector: 'tailwind-icon',
  host: {
    class: 'inline-flex shrink-0 items-center justify-center'
  },
  templateUrl: './icon.component.html'
})
export class TailwindIcon extends TailwindComponent {
  private readonly iconSize = inject(TAILWIND_ICON_SIZE, { optional: true });

  /** Heroicon name; SVG path `public/icons/<name>.svg` */
  readonly icon = input.required<TailwindHeroIcon>();
  /** `normal` = 24×24, `small` = 16×16; default dalla DI (`TAILWIND_ICON_SIZE`) se presente */
  readonly size = input<TailwindIconSize>(this.iconSize ?? 'normal');
  /** When set, exposes the icon to assistive tech (`alt`); otherwise decorative (`aria-hidden`) */
  readonly label = input<string | undefined>(undefined);

  readonly src = computed(() => `/icons/${this.icon()}.svg`);

  readonly pixelSize = computed(() => (this.size() === 'small' ? 16 : 24));
}
