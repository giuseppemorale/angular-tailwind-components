import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import type { TailwindHeroicon, TailwindIconPosition } from '../../models';
import { TailwindSize, TailwindPalette, TailwindButtonKind, TailwindButtonRole } from '../../models';
import { TAILWIND_BUTTON_KIND } from '../../tokens';
import { buttonKindClasses, buttonPaletteStyleVars } from '../../utils/button-palette.util';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

const iconPixelSizeMap: Record<TailwindSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22
};

@Component({
  imports: [NgClass, TailwindIcon],
  selector: 'tailwind-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindButton extends TailwindComponent {
  private readonly defaultKind = inject(TAILWIND_BUTTON_KIND, { optional: true });

  /** Tailwind palette family for button surfaces */
  readonly color = input<TailwindPalette>('neutral');
  /**
   * Visual kind: `flat` = filled like `solid` without border, shadow, or hover/active background change;
   * `ghost` = transparent with hover tint; `text` = text color only, no hover background.
   * Default from {@link TAILWIND_BUTTON_KIND} or `'solid'`.
   */
  readonly kind = input<TailwindButtonKind>(this.defaultKind ?? 'solid');
  /** Size of the button */
  readonly size = input<TailwindSize>('md');
  /** Whether the button is disabled */
  readonly disabled = input<boolean>(false);
  /** HTML button type attribute */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** ARIA role attribute */
  readonly role = input<TailwindButtonRole>('button');
  /** Optional Heroicons outline icon inside the button */
  readonly icon = input<TailwindHeroicon | undefined>();
  /** Icon placement when both icon and label are shown */
  readonly iconPosition = input<TailwindIconPosition>('left');
  /** Accessible name for icon-only buttons */
  readonly ariaLabel = input<string>('');

  /** Emitted when the button is clicked (not disabled). */
  readonly onClick = output<MouseEvent>();

  readonly iconPixelSize = computed(() => iconPixelSizeMap[this.size()]);

  readonly paletteStyle = computed(() => buttonPaletteStyleVars(this.color()));

  /** Computed Tailwind classes based on kind, size, and state */
  readonly computedClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-5 py-2.5 rounded-lg',
      xl: 'text-base px-6 py-3 rounded-lg'
    };

    const iconOnlySizeMap: Record<TailwindSize, string> = {
      xs: 'has-[.tailwind-button-label:empty]:p-1 has-[.tailwind-button-label:empty]:px-1',
      sm: 'has-[.tailwind-button-label:empty]:p-1.5 has-[.tailwind-button-label:empty]:px-1.5',
      md: 'has-[.tailwind-button-label:empty]:p-2 has-[.tailwind-button-label:empty]:px-2',
      lg: 'has-[.tailwind-button-label:empty]:p-2.5 has-[.tailwind-button-label:empty]:px-2.5',
      xl: 'has-[.tailwind-button-label:empty]:p-3 has-[.tailwind-button-label:empty]:px-3'
    };

    const size = this.size();
    const sizeClasses = [sizeMap[size], this.icon() ? iconOnlySizeMap[size] : ''].filter(Boolean).join(' ');

    return [buttonKindClasses(this.kind()), sizeClasses].join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.onClick.emit(event);
    }
  }
}
