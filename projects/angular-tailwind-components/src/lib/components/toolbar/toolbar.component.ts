import { Component, computed, input, output } from '@angular/core';
import { TailwindMenuItem, TailwindSeverity } from '../../models';
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
  /**
   * Colore di superficie della barra: `default` mantiene sfondo bianco;
   * i valori `TailwindSeverity` applicano tinte semantiche (come alert/notification).
   */
  readonly variant = input<TailwindSeverity | 'default'>('default');
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

  readonly menuItemToneClasses = computed(() =>
    this.variant() === 'default'
      ? 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
      : 'text-neutral-900 hover:bg-black/5'
  );

  readonly menuItemButtonClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const layout = horizontal
      ? 'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium'
      : 'inline-flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-medium';
    const rest =
      'disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-0 bg-transparent';
    return [layout, this.menuItemToneClasses(), rest].join(' ');
  });

  readonly mobileMenuToggleClasses = computed(() =>
    [
      'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-2 transition-colors',
      this.menuItemToneClasses()
    ].join(' ')
  );

  readonly menuDividerLineClasses = computed(() =>
    this.variant() === 'default'
      ? 'mx-0.5 h-5 w-px shrink-0 self-center bg-neutral-200'
      : 'mx-0.5 h-5 w-px shrink-0 self-center bg-neutral-900/15'
  );

  readonly menuDividerRuleClasses = computed(() =>
    this.variant() === 'default'
      ? 'my-1 w-full border-0 border-t border-neutral-100'
      : 'my-1 w-full border-0 border-t border-neutral-900/10'
  );

  readonly rootClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const sizeClasses = horizontal
      ? this.width() === 'full'
        ? 'w-full h-16'
        : 'container mx-auto h-16'
      : 'h-full w-full';

    const variant = this.variant();
    const surfaceMap: Record<TailwindSeverity | 'default', string> = {
      default: 'bg-white border border-neutral-200',
      success: 'bg-success-500 border border-success-200',
      warning: 'bg-warning-500 border border-warning-200',
      danger: 'bg-danger-500 border border-danger-200',
      info: 'bg-info-500 border border-info-200'
    };

    const base = [
      surfaceMap[variant] ?? surfaceMap.default,
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
