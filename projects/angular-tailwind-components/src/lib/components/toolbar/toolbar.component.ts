import { Component, computed, input, output } from '@angular/core';
import { TailwindMenuItem } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindMenu } from '../menu/menu.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindMenu],
  selector: 'tailwind-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class TailwindToolbar extends TailwindComponent {
  /** When true, uses rounded corners (`rounded-xl`). */
  readonly rounded = input<boolean>(true);
  /**
   * Orizzontale: `full` = `w-full`; `container` = larghezza responsiva (95% / 85% / 75%) centrata.
   * Verticale: ignorato per l’altezza — il rail è sempre `h-full w-full` nella colonna.
   */
  readonly width = input<'full' | 'container'>('full');
  /** Applies a stronger drop shadow. */
  readonly elevated = input<boolean>(false);
  /** `horizontal` for a top app bar; `vertical` for a side rail (logo → menu → end). */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Navigation / actions rendered between logo and end slots. */
  readonly menu = input<TailwindMenuItem[]>([]);

  /** Emitted when a non-disabled, non-divider menu entry is activated. */
  readonly onMenuSelect = output<TailwindMenuItem>();

  readonly menuContainerClasses = computed(() =>
    this.orientation() === 'horizontal'
      ? 'min-w-0 flex-1 flex flex-row flex-wrap items-center gap-1'
      : 'min-w-0 flex-1 flex flex-col gap-1.5 overflow-y-auto min-h-0'
  );

  readonly menuItemButtonClasses = computed(() =>
    this.orientation() === 'horizontal'
      ? 'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-0 bg-transparent'
      : 'inline-flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-medium text-surface-700 hover:bg-surface-100 hover:text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-0 bg-transparent'
  );

  readonly rootClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const sizeClasses = horizontal
      ? this.width() === 'full'
        ? 'w-full'
        : 'w-[95%] md:w-[85%] lg:w-[75%] mx-auto'
      : 'h-full w-full';

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

  selectMenuItem(item: TailwindMenuItem): void {
    if (item.divider || item.disabled) {
      return;
    }
    this.onMenuSelect.emit(item);
  }

  /** True when `label` is a non-empty string after trim (icon-only entries omit or blank `label`). */
  menuItemHasVisibleLabel(item: TailwindMenuItem): boolean {
    const label = item.label;
    return typeof label === 'string' && label.trim().length > 0;
  }

  /** Accessible name when there is no visible label (`value`, trimmed). */
  menuItemAriaLabel(item: TailwindMenuItem): string | null {
    if (this.menuItemHasVisibleLabel(item)) {
      return null;
    }
    const v = item.value;
    return v != null && String(v).trim().length > 0 ? String(v).trim() : null;
  }

  menuTrackKey(index: number, item: TailwindMenuItem): string {
    return item.value ?? item.label ?? String(index);
  }
}
