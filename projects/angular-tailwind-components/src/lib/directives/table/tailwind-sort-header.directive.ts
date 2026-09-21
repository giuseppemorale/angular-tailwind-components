import {
  ApplicationRef,
  computed,
  ComponentRef,
  createComponent,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injector,
  input,
  Renderer2
} from '@angular/core';
import { TailwindIcon } from '../../components/icon/icon.component';
import { TAILWIND_TABLE_SORT_HOST } from '../../components/table/interfaces/tailwind-table-sort-host';
import { TAILWIND_LABELS } from '../../tokens';

/**
 * Sortable column header: put on `<th>`; non-sortable columns omit it.
 * The owning `tailwind-table` is resolved through DI and its sorting signals are read directly.
 */
@Directive({
  selector: '[tailwindSortHeader]',
  host: {
    // The focus ring is drawn *inside* the cell (`-outline-offset-2`): the table clips its own
    // corners so the rounded border reads as rounded, and an outward ring on the first or last
    // column would be clipped away with them.
    class:
      'cursor-pointer whitespace-nowrap text-left select-none hover:text-fg ' +
      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
    '[class.bg-primary-50]': 'isActive()',
    '[attr.tabindex]': '0',
    // The `th` is operated like a button; without a role, assistive tech announces a plain header.
    '[attr.role]': '"columnheader"',
    '[attr.data-sort-key]': 'sortKey()',
    '[attr.aria-sort]': 'ariaSort()',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'activate()',
    '(keydown)': 'onKeydown($event)'
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
  private readonly labels = inject(TAILWIND_LABELS);
  private readonly table = inject(TAILWIND_TABLE_SORT_HOST, { optional: true });

  private labelWrapper?: HTMLElement;
  private iconRef?: ComponentRef<TailwindIcon>;

  /** `true` when this column is the one the table is currently sorted by. */
  protected readonly isActive = computed(() => !!this.table && this.table.sortKey() === this.sortKey());
  private readonly isAscending = computed(() => this.table?.sortDir() !== 'desc');

  protected readonly ariaSort = computed(() =>
    this.isActive() ? (this.isAscending() ? 'ascending' : 'descending') : 'none'
  );

  protected readonly ariaLabel = computed(() =>
    this.isActive()
      ? this.isAscending()
        ? this.labels.sortedAscending
        : this.labels.sortedDescending
      : this.labels.sortBy.replace('{column}', this.sortKey())
  );

  private readonly indicatorIcon = computed(() => {
    if (!this.isActive()) return 'chevron-up-down' as const;
    return this.isAscending() ? ('chevron-up' as const) : ('chevron-down' as const);
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.iconRef?.destroy();
      this.iconRef = undefined;
    });

    // One reactive sync, replacing a MutationObserver on the table's host attributes plus a
    // requestAnimationFrame retry loop that waited for the projected `<th>` to land in the DOM.
    effect(() => {
      const icon = this.indicatorIcon();
      const active = this.isActive();
      const ref = this.ensureIcon();
      ref.setInput('icon', icon);
      ref.setInput('size', 14);
      ref.setInput('class', active ? 'shrink-0 text-primary-600' : 'shrink-0 text-neutral-600');
      ref.changeDetectorRef.detectChanges();
    });
  }

  protected activate(): void {
    this.table?.sort(this.sortKey());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.activate();
  }

  private ensureIcon(): ComponentRef<TailwindIcon> {
    if (this.iconRef) return this.iconRef;

    const labelHost = this.ensureLabelWrapper();
    this.iconRef = createComponent(TailwindIcon, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });
    this.renderer.appendChild(labelHost, this.iconRef.location.nativeElement);
    this.appRef.attachView(this.iconRef.hostView);
    return this.iconRef;
  }

  /** Keep `th` as `display: table-cell`; flex only on an inner wrapper (label + icon). */
  private ensureLabelWrapper(): HTMLElement {
    if (this.labelWrapper) return this.labelWrapper;

    const th = this.host.nativeElement;
    const existing = th.querySelector('[data-tw-sort-header-label]');
    if (existing instanceof HTMLElement) {
      this.labelWrapper = existing;
      return existing;
    }

    const wrapper = this.renderer.createElement('span');
    this.renderer.setAttribute(wrapper, 'data-tw-sort-header-label', '');
    for (const cls of ['inline-flex', 'items-center', 'gap-1.5', 'justify-start']) {
      this.renderer.addClass(wrapper, cls);
    }

    for (const child of Array.from(th.childNodes)) {
      this.renderer.appendChild(wrapper, child);
    }
    this.renderer.appendChild(th, wrapper);
    this.labelWrapper = wrapper;
    return wrapper;
  }
}
