import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
/** Host attributes on `<tailwind-table>`; kept in sync for sort-header observers. */
export const TW_TABLE_SORT_KEY_ATTR = 'data-tw-sort-key';
export const TW_TABLE_SORT_DIR_ATTR = 'data-tw-sort-dir';

/**
 * Sortable column header: put on `<th>` (plain header text + directive). Not sortable columns omit this directive.
 * Sorting is handled by the nearest `tailwind-table` host (event delegation); do not pass a table reference.
 */
@Directive({
  selector: '[tailwindSortHeader]',
  standalone: true,
  host: {
    class:
      'cursor-pointer hover:text-surface-900 select-none table-cell align-middle whitespace-nowrap text-left',
    '[attr.tabindex]': '0',
    '[attr.data-sort-key]': 'sortKey()'
  }
})
export class TailwindSortHeaderDirective {
  /** Property key on each row used for sorting. */
  readonly sortKey = input.required<string>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private svg?: SVGSVGElement;

  constructor() {
    effect(onCleanup => {
      const key = this.sortKey();
      const tableEl = this.host.nativeElement.closest('tailwind-table');
      if (!tableEl) return;

      const sync = (): void => {
        const activeKey = tableEl.getAttribute(TW_TABLE_SORT_KEY_ATTR) ?? '';
        const dirRaw = tableEl.getAttribute(TW_TABLE_SORT_DIR_ATTR) ?? 'asc';
        const asc = dirRaw === 'asc';
        const active = activeKey === key;

        if (!this.svg) {
          this.svg = this.createSvg();
          this.renderer.appendChild(this.host.nativeElement, this.svg);
        }
        this.updateSvg(active, asc);
        this.renderer.setAttribute(
          this.host.nativeElement,
          'aria-label',
          active ? `Sorted ${asc ? 'ascending' : 'descending'}, activate to reverse` : `Sort by ${key}`
        );
      };

      sync();
      const mo = new MutationObserver(() => sync());
      mo.observe(tableEl, {
        attributes: true,
        attributeFilter: [TW_TABLE_SORT_KEY_ATTR, TW_TABLE_SORT_DIR_ATTR]
      });
      onCleanup(() => mo.disconnect());
    });
  }

  private createSvg(): SVGSVGElement {
    const svg = this.renderer.createElement('svg', 'svg') as SVGSVGElement;
    this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'viewBox', '0 0 20 20');
    this.renderer.setAttribute(svg, 'fill', 'currentColor');
    this.renderer.setAttribute(svg, 'aria-hidden', 'true');

    const ascPath = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(ascPath, 'fill-rule', 'evenodd');
    this.renderer.setAttribute(
      ascPath,
      'd',
      'M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z'
    );
    this.renderer.setAttribute(ascPath, 'clip-rule', 'evenodd');
    this.renderer.addClass(ascPath, 'tailwind-sort-header__asc');

    const descPath = this.renderer.createElement('path', 'svg');
    this.renderer.setAttribute(descPath, 'fill-rule', 'evenodd');
    this.renderer.setAttribute(
      descPath,
      'd',
      'M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z'
    );
    this.renderer.setAttribute(descPath, 'clip-rule', 'evenodd');
    this.renderer.addClass(descPath, 'tailwind-sort-header__desc');

    this.renderer.appendChild(svg, ascPath);
    this.renderer.appendChild(svg, descPath);
    return svg;
  }

  private updateSvg(active: boolean, asc: boolean): void {
    if (!this.svg) return;

    this.renderer.setAttribute(
      this.svg,
      'class',
      `inline-block align-middle ml-1 w-3.5 h-3.5 shrink-0 ${active ? 'text-primary-600' : 'text-surface-400'}`
    );

    const ascPath = this.svg.querySelector('.tailwind-sort-header__asc');
    const descPath = this.svg.querySelector('.tailwind-sort-header__desc');

    const showAsc = active && asc;
    const showDesc = active ? !asc : true;

    this.setPathHidden(ascPath, !showAsc);
    this.setPathHidden(descPath, !showDesc);
  }

  private setPathHidden(el: Element | null, hidden: boolean): void {
    if (!el) return;
    if (hidden) this.renderer.addClass(el, 'hidden');
    else this.renderer.removeClass(el, 'hidden');
  }
}
