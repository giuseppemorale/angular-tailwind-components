import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import type { TailwindHeroicon, TailwindIconPosition } from '../../models';
import { TailwindSize, TailwindColor, TailwindButtonKind, TailwindButtonRole } from '../../models';
import { TAILWIND_BUTTON_KIND, TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { CONTROL_SIZE, ICON_PIXEL_SIZE } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import { BASE, ICON_ONLY_SIZE, STYLE } from './properties/constant';

@Component({
  imports: [NgClass, TailwindIcon],
  selector: 'tailwind-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindButton extends TailwindComponent {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });

  private readonly defaultKind = inject(TAILWIND_BUTTON_KIND, { optional: true });

  /** Visual color. */
  readonly color = input<TailwindColor>('primary');
  /** Visual kind; defaults to {@link TAILWIND_BUTTON_KIND} or `'solid'`. */
  readonly kind = input<TailwindButtonKind>(this.defaultKind ?? 'solid');
  /** Size of the button. */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Whether the button is disabled. */
  readonly disabled = input<boolean>(false);
  /** Shows a spinner in place of the icon and blocks activation; the label stays visible. */
  readonly loading = input<boolean>(false);
  /** Stretches the button to the full width of its container. */
  readonly fullWidth = input<boolean>(false);
  /** HTML button type attribute. */
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  /** ARIA role; `button` writes nothing since the native element already has it. */
  readonly role = input<TailwindButtonRole>('button');
  /** Optional Heroicons outline icon inside the button. */
  readonly icon = input<TailwindHeroicon | undefined>();
  /** Icon placement when both icon and label are shown. */
  readonly iconPosition = input<TailwindIconPosition>('left');
  /** Accessible name for icon-only buttons. */
  readonly ariaLabel = input<string>('');
  /** Toggle state for toolbar-style buttons (`aria-pressed`). */
  readonly ariaPressed = input<boolean | undefined>(undefined);
  /** Marks this button as the current item of a set (`aria-current`). */
  readonly ariaCurrent = input<'page' | 'step' | 'location' | 'date' | 'time' | 'true' | undefined>(undefined);

  readonly iconPixelSize = computed(() => ICON_PIXEL_SIZE[this.size()]);

  /** A loading button is not activatable, so it is disabled at the DOM level too. */
  readonly isDisabled = computed(() => this.disabled() || this.loading());

  readonly computedClasses = computed(() => {
    const size = this.size();
    const sizeClasses = [
      CONTROL_SIZE[size],
      // A full-width button is never icon-only, so the square override would only fight `w-full`.
      (this.icon() || this.loading()) && !this.fullWidth() ? ICON_ONLY_SIZE[size] : '',
      this.fullWidth() ? 'w-full' : ''
    ]
      .filter(Boolean)
      .join(' ');

    return this.mergeClasses(...BASE, STYLE[this.kind()][this.color()] || STYLE['solid']['primary'], sizeClasses);
  });
}
