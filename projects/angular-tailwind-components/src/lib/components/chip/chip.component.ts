import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TailwindColor, TailwindSize, TailwindVariantKind } from '../../models';
import { semanticSurface } from '../../util/variants';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindChip extends TailwindComponent {
  /** Semantic color */
  readonly color = input<TailwindColor>('secondary');
  /** How the surface is painted; `soft` (default) is the chip's long-standing look. */
  readonly kind = input<TailwindVariantKind>('soft');
  /** Size variant */
  readonly size = input<TailwindSize>('sm');
  /** Show remove button */
  readonly removable = input<boolean>(true);
  /** Disables remove interaction */
  readonly disabled = input<boolean>(false);
  /** Accessible label for the chip (falls back to projected text when omitted) */
  readonly ariaLabel = input<string>('');
  /** Truncate label with ellipsis when space is constrained (e.g. inside multi-select) */
  readonly truncate = input(false, { transform: booleanAttribute });
  /** Accessible label for the remove button */
  readonly removeAriaLabel = input<string>('Remove');

  /** Emitted when the remove button is activated */
  readonly removed = output<void>();

  readonly computedClasses = computed(() => {
    const base = ['inline-flex items-center gap-0.5 border font-medium max-w-full', 'leading-tight'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5'
    };

    return this.mergeClasses(
      ...base,
      semanticSurface(this.kind(), this.color()),
      sizeMap[this.size()],
      'rounded-control'
    );
  });

  readonly labelClasses = computed(() => (this.truncate() ? 'min-w-0 truncate' : 'whitespace-nowrap'));

  readonly removeIconSize = computed(() => {
    const map: Record<TailwindSize, number> = {
      xs: 12,
      sm: 14,
      md: 14,
      lg: 16,
      xl: 16
    };
    return map[this.size()];
  });

  readonly removeButtonClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'p-0.5',
      sm: 'p-0.5',
      md: 'p-0.5',
      lg: 'p-1',
      xl: 'p-1'
    };

    return [
      'inline-flex shrink-0 items-center justify-center rounded-control-inner',
      'text-current opacity-70 hover:opacity-100',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      sizeMap[this.size()]
    ].join(' ');
  });

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.disabled()) return;
    this.removed.emit();
  }
}
