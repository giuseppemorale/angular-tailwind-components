import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TailwindMenuItem, TailwindPalette } from '../../models';
import { contrastTextClass, filledBarClasses, PALETTE_ACCENT_SHADE } from '../../utils/palette.util';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindMenu } from '../menu/menu.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindMenu],
  selector: 'tailwind-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindToolbar extends TailwindComponent {
  readonly rounded = input<boolean>(true);
  readonly width = input<'full' | 'container'>('full');
  readonly elevated = input<boolean>(false);
  /** Surface palette; omit for white default bar */
  readonly color = input<TailwindPalette | undefined>(undefined);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly menu = input<TailwindMenuItem[]>([]);
  readonly onMenuSelect = output<TailwindMenuItem>();

  readonly mobileMenuItems = computed(() => this.flattenMenuItems(this.menu()));

  readonly submenuPlacement = computed((): 'bottom' | 'right' =>
    this.orientation() === 'horizontal' ? 'bottom' : 'right'
  );

  readonly submenuChevronIcon = computed(() =>
    this.orientation() === 'horizontal' ? 'chevron-down' : 'chevron-right'
  );

  readonly menuItemWithSubmenuClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    return horizontal ? 'relative inline-flex shrink-0' : 'relative w-full';
  });

  readonly menuContainerClasses = computed(() =>
    this.orientation() === 'horizontal'
      ? 'min-w-0 flex-1 flex flex-row flex-wrap items-center gap-1'
      : 'min-w-0 flex-1 flex flex-col gap-1.5 overflow-y-auto min-h-0'
  );

  readonly colorContrastTextClass = computed((): string | null => {
    const palette = this.color();
    if (!palette) {
      return null;
    }
    const shade = palette === 'amber' || palette === 'yellow' ? 500 : PALETTE_ACCENT_SHADE;
    return contrastTextClass(palette, shade);
  });

  readonly menuItemIconClasses = computed(() => {
    const palette = this.color();
    if (!palette || palette === 'amber' || palette === 'yellow') {
      return '';
    }
    return 'toolbar-menu-icon-on-light';
  });

  readonly menuItemToneClasses = computed(() => {
    const contrast = this.colorContrastTextClass();
    if (!contrast) {
      return 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900';
    }
    return `${contrast} hover:bg-white/12`;
  });

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
    this.color()
      ? 'mx-0.5 h-5 w-px shrink-0 self-center bg-white/30'
      : 'mx-0.5 h-5 w-px shrink-0 self-center bg-neutral-200'
  );

  readonly menuDividerRuleClasses = computed(() =>
    this.color()
      ? 'my-1 w-full border-0 border-t border-white/25'
      : 'my-1 w-full border-0 border-t border-neutral-100'
  );

  readonly rootClasses = computed(() => {
    const horizontal = this.orientation() === 'horizontal';
    const sizeClasses = horizontal
      ? this.width() === 'full'
        ? 'w-full h-16'
        : 'container mx-auto h-16'
      : 'h-full w-full';

    const palette = this.color();
    const shade = palette && (palette === 'amber' || palette === 'yellow') ? 500 : PALETTE_ACCENT_SHADE;
    const surface = palette
      ? `${filledBarClasses(palette, shade)} border border-white/20`
      : 'bg-white border border-neutral-200';

    const base = [
      surface,
      this.colorContrastTextClass() ?? '',
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

    return base.filter(Boolean).join(' ');
  });

  hasSubmenu(item: TailwindMenuItem): boolean {
    return Array.isArray(item.items) && item.items.length > 0;
  }

  selectMenuItem(item: TailwindMenuItem): void {
    if (item.divider || item.disabled || this.hasSubmenu(item)) {
      return;
    }
    this.onMenuSelect.emit(item);
  }

  private flattenMenuItems(items: TailwindMenuItem[]): TailwindMenuItem[] {
    const flat: TailwindMenuItem[] = [];
    for (const item of items) {
      if (this.hasSubmenu(item)) {
        flat.push(...item.items!);
      } else {
        flat.push(item);
      }
    }
    return flat;
  }

  menuItemHasVisibleLabel(item: TailwindMenuItem): boolean {
    const label = item.label;
    return typeof label === 'string' && label.trim().length > 0;
  }

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
