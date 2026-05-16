import {
  ApplicationRef,
  afterNextRender,
  ComponentRef,
  DestroyRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Injector,
  Renderer2,
  createComponent,
  inject,
  input
} from '@angular/core';
import { TailwindIcon } from '../../components/icon/icon.component';
/** Host attributes on `<tailwind-table>`; kept in sync for sort-header observers. */
export const TW_TABLE_SORT_KEY_ATTR = 'data-tw-sort-key';
export const TW_TABLE_SORT_DIR_ATTR = 'data-tw-sort-dir';

const MAX_TABLE_RESOLVE_ATTEMPTS = 24;

/**
 * Sortable column header: put on `<th>` (plain header text + directive). Not sortable columns omit this directive.
 * Sorting is handled by the nearest `tailwind-table` host (event delegation); do not pass a table reference.
 */
@Directive({
  selector: '[tailwindSortHeader]',
  standalone: true,
  host: {
    class:
      'flex cursor-pointer items-center gap-1.5 justify-start whitespace-nowrap text-left select-none hover:text-surface-900',
    '[attr.tabindex]': '0',
    '[attr.data-sort-key]': 'sortKey()'
  }
})
export class TailwindSortHeaderDirective {
  /** Property key on each row used for sorting. */
  readonly sortKey = input.required<string>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);

  private iconRef?: ComponentRef<TailwindIcon>;
  private mo?: MutationObserver;
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.destroyed = true;
      this.mo?.disconnect();
      this.mo = undefined;
      this.iconRef?.destroy();
      this.iconRef = undefined;
    });

    afterNextRender(
      () => {
        if (!this.destroyed) {
          this.resolveTableAndAttach(0);
        }
      },
      { injector: this.injector }
    );
  }

  /**
   * After first render the projected `<th>` may still not be under `<tailwind-table>` in the DOM
   * for one frame; retry with `requestAnimationFrame` until `closest` succeeds.
   */
  private resolveTableAndAttach(attempt: number): void {
    if (this.destroyed || this.mo) return;

    const tableEl = this.host.nativeElement.closest('tailwind-table');
    if (!tableEl) {
      if (attempt < MAX_TABLE_RESOLVE_ATTEMPTS) {
        requestAnimationFrame(() => this.resolveTableAndAttach(attempt + 1));
      }
      return;
    }

    const sync = (): void => {
      if (this.destroyed || !this.iconRef) return;

      const columnKey = this.sortKey();
      const activeKey = tableEl.getAttribute(TW_TABLE_SORT_KEY_ATTR) ?? '';
      const dirRaw = tableEl.getAttribute(TW_TABLE_SORT_DIR_ATTR) ?? 'asc';
      const asc = dirRaw === 'asc';
      const active = activeKey === columnKey;

      const icon = active ? (asc ? 'chevron-up' : 'chevron-down') : 'chevron-up-down';
      this.iconRef.setInput('icon', icon);
      this.iconRef.setInput('size', 14);
      this.iconRef.setInput(
        'class',
        active ? 'shrink-0 text-primary-600' : 'shrink-0 text-surface-400'
      );

      this.renderer.setAttribute(
        this.host.nativeElement,
        'aria-label',
        active ? `Sorted ${asc ? 'ascending' : 'descending'}, activate to reverse` : `Sort by ${columnKey}`
      );

      this.iconRef.changeDetectorRef.detectChanges();
    };

    if (!this.iconRef) {
      this.iconRef = createComponent(TailwindIcon, {
        environmentInjector: this.environmentInjector,
        elementInjector: this.injector
      });
      this.renderer.appendChild(this.host.nativeElement, this.iconRef.location.nativeElement);
      this.appRef.attachView(this.iconRef.hostView);
    }

    sync();

    this.mo = new MutationObserver(() => sync());
    this.mo.observe(tableEl, {
      attributes: true,
      attributeFilter: [TW_TABLE_SORT_KEY_ATTR, TW_TABLE_SORT_DIR_ATTR]
    });
  }
}
