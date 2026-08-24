import {
  ApplicationRef,
  ComponentRef,
  computed,
  createComponent,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injector,
  Renderer2
} from '@angular/core';
import { TailwindCheckbox } from '../../components/checkbox/checkbox.component';
import { TAILWIND_TABLE_SELECTION_HOST } from '../../components/table/interfaces/tailwind-table-sort-host';
import { TAILWIND_LABELS } from '../../tokens';

/**
 * Renders the "select all rows" checkbox into a header cell:
 * `<th tailwindSelectAllHeader></th>`.
 *
 * It is a directive on the consumer's own `<th>` rather than a cell the table injects, because the
 * `<thead>` is written in the consumer's template — the table cannot add a column to it without
 * producing invalid markup. The owning table is resolved through DI, exactly like the sort header.
 *
 * The box reflects the whole filtered result, not just the visible page: selecting it selects every
 * row matching the current search, and it shows the mixed state while only some are selected.
 */
@Directive({
  selector: '[tailwindSelectAllHeader]',
  host: {
    class: 'w-10 whitespace-nowrap',
    '[attr.scope]': '"col"'
  }
})
export class TailwindSelectAllHeaderDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly injector = inject(Injector);
  private readonly labels = inject(TAILWIND_LABELS);
  private readonly table = inject(TAILWIND_TABLE_SELECTION_HOST, { optional: true });

  private checkboxRef?: ComponentRef<TailwindCheckbox>;
  private checkedSub?: { unsubscribe(): void };

  private readonly allSelected = computed(() => this.table?.allFilteredSelected() ?? false);
  private readonly someSelected = computed(() => this.table?.someFilteredSelected() ?? false);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.checkedSub?.unsubscribe();
      this.checkboxRef?.destroy();
      this.checkboxRef = undefined;
    });

    effect(() => {
      const all = this.allSelected();
      const some = this.someSelected();
      const ref = this.ensureCheckbox();
      ref.setInput('checked', all);
      ref.setInput('indeterminate', some);
      ref.setInput('ariaLabel', this.labels.selectAll);
      ref.changeDetectorRef.detectChanges();
    });
  }

  private ensureCheckbox(): ComponentRef<TailwindCheckbox> {
    if (this.checkboxRef) return this.checkboxRef;

    this.checkboxRef = createComponent(TailwindCheckbox, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });
    this.renderer.appendChild(this.host.nativeElement, this.checkboxRef.location.nativeElement);
    this.appRef.attachView(this.checkboxRef.hostView);

    this.checkedSub = this.checkboxRef.instance.checked.subscribe(() => this.table?.toggleAllFiltered());
    return this.checkboxRef;
  }
}
