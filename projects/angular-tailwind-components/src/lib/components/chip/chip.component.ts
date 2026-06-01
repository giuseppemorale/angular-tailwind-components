import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output
} from '@angular/core';
import { TailwindColor, TailwindSize } from '../../models';
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
    const base = ['inline-flex items-center gap-0.5 font-medium max-w-full', 'leading-tight'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5'
    };

    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-100 text-primary-800',
      secondary: 'bg-neutral-100 text-neutral-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-900',
      danger: 'bg-danger-100 text-danger-800',
      info: 'bg-info-100 text-info-800',
      transparent: 'bg-transparent text-neutral-700 border border-neutral-200'
    };

    return [...base, colorMap[this.color()], sizeMap[this.size()], 'rounded-md'].join(' ');
  });

  readonly labelClasses = computed(() =>
    this.truncate() ? 'min-w-0 truncate' : 'whitespace-nowrap'
  );

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
      'inline-flex shrink-0 items-center justify-center rounded-sm',
      'text-current opacity-70 hover:opacity-100',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500',
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
