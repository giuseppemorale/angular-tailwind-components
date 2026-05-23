import { NgTemplateOutlet } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  NgZone,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';
import { TailwindOption, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

/** Context passed to the `#item` ng-template. */
export interface TailwindAutocompleteItemContext<T = unknown> {
  $implicit: TailwindOption<T>;
  option: TailwindOption<T>;
  index: number;
  selected: boolean;
  active: boolean;
}

@Component({
  imports: [NgTemplateOutlet, TailwindIcon],
  selector: 'tailwind-autocomplete',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindAutocomplete),
      multi: true
    }
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindAutocomplete<T = unknown> extends TailwindComponent implements ControlValueAccessor, OnDestroy {
  private static nextId = 0;

  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  constructor() {
    super();
    effect(() => {
      const opts = this.filteredOptions();
      if (!this.isOpen()) return;

      const v = this.value();
      let initial = -1;
      if (v != null) {
        initial = opts.findIndex(o => this.optionValueEquals(o.value, v));
      } else if (opts.length > 0) {
        initial = 0;
      }
      this.activeIndex.set(initial >= 0 ? initial : -1);
      this.cdr.detectChanges();
    });
  }

  private overlayRef: OverlayRef | null = null;
  private outsideSub: Subscription | null = null;
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly instanceListboxId = `tailwind-autocomplete-listbox-${++TailwindAutocomplete.nextId}`;

  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Available options */
  readonly options = input<TailwindOption<T>[]>([]);
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Helper text */
  readonly helperText = input<string>('');
  /** Error text */
  readonly errorText = input<string>('');
  /** Whether in error state */
  readonly hasError = input<boolean>(false);
  /** Filter options locally by label when typing */
  readonly filterLocally = input(true);
  /** Minimum query length before opening panel and emitting onSearch */
  readonly minSearchLength = input(0);
  /** Debounce delay (ms) for onSearch emission only */
  readonly debounceMs = input(0);
  /** On blur, reset input to selected option label or clear invalid text */
  readonly forceSelection = input(true);

  /** Selected value (form control) — set only when an option is chosen */
  readonly value = model<T | null>(null);

  /** Emits the current search query (after debounce / minSearchLength) */
  readonly onSearch = output<string>();

  /** Custom option row template (`ng-template` with `#item`) */
  readonly itemTemplate = contentChild('item', { read: TemplateRef });

  /** Text shown in the input */
  readonly searchQuery = signal('');

  readonly isDisabled = signal(false);
  readonly isOpen = signal(false);
  readonly activeIndex = signal(-1);

  readonly listboxId = computed(() => (this.id() ? `${this.id()}-listbox` : this.instanceListboxId));

  readonly selectedOption = computed(() => {
    const v = this.value();
    if (v == null) return null;
    return this.options().find(o => this.optionValueEquals(o.value, v)) ?? null;
  });

  readonly filteredOptions = computed(() => {
    const opts = this.options();
    if (!this.filterLocally()) return opts;
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return opts;
    return opts.filter(o => o.label.toLowerCase().includes(q));
  });

  readonly inputClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-3 py-2 rounded-md',
      lg: 'text-base px-3.5 py-2.5 rounded-lg',
      xl: 'text-base px-4 py-3 rounded-lg'
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-neutral-300 focus:outline-primary-500 text-neutral-900';

    return [
      'block w-full bg-white border transition-colors duration-150',
      'placeholder:text-neutral-400',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
      sizeMap[this.size()],
      stateClass
    ].join(' ');
  });

  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | null | undefined): void {
    this.value.set(value ?? null);
    const opt = this.options().find(o => this.optionValueEquals(o.value, value));
    this.searchQuery.set(opt?.label ?? '');
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  ngOnDestroy(): void {
    if (this.searchDebounceTimer != null) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.closePanel();
  }

  isOptionSelected(option: TailwindOption<T>): boolean {
    const v = this.value();
    if (v == null) return false;
    return this.optionValueEquals(option.value, v);
  }

  optionClasses(index: number, option: TailwindOption<T>): string {
    const isSelected = this.isOptionSelected(option);
    const isActive = this.activeIndex() === index;
    const isDisabled = !!option.disabled;

    return [
      'flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none',
      isDisabled
        ? 'text-neutral-400 cursor-not-allowed'
        : isSelected
          ? 'bg-primary-50 text-primary-700 font-medium'
          : isActive
            ? 'bg-neutral-100 text-neutral-900'
            : 'text-neutral-800 hover:bg-neutral-50'
    ].join(' ');
  }

  itemContext(option: TailwindOption<T>, index: number): TailwindAutocompleteItemContext<T> {
    return {
      $implicit: option,
      option,
      index,
      selected: this.isOptionSelected(option),
      active: this.activeIndex() === index
    };
  }

  onInputChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.cdr.markForCheck();

    const selected = this.selectedOption();
    if (selected && query !== selected.label) {
      this.value.set(null);
      this.onChange(null);
    }

    this.emitSearch(query);

    if (query.length >= this.minSearchLength()) {
      this.openPanel();
    } else {
      this.closePanel();
    }
  }

  onFocus(): void {
    if (this.isDisabled()) return;
    if (this.searchQuery().length >= this.minSearchLength()) {
      this.openPanel();
    }
  }

  onBlur(): void {
    this.onTouched();
    queueMicrotask(() => this.applyForceSelectionOnBlur());
  }

  private applyForceSelectionOnBlur(): void {
    if (!this.forceSelection() || this.isOpen()) return;

    const active = document.activeElement;
    const host = this.elRef.nativeElement;
    const pane = this.overlayRef?.overlayElement;
    if (active && (host.contains(active) || pane?.contains(active))) return;

    const selected = this.selectedOption();
    const query = this.searchQuery();

    if (selected) {
      if (query !== selected.label) {
        this.searchQuery.set(selected.label);
      }
      return;
    }

    if (query) {
      this.searchQuery.set('');
    }
  }

  selectOption(option: TailwindOption<T>): void {
    if (option.disabled) return;
    this.value.set(option.value);
    this.searchQuery.set(option.label);
    this.onChange(option.value);
    this.onTouched();
    this.closePanel();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const opts = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
          return;
        }
        let next = this.activeIndex() + 1;
        while (next < opts.length && opts[next].disabled) next++;
        if (next < opts.length) this.activeIndex.set(next);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
          return;
        }
        let prev = this.activeIndex() - 1;
        while (prev >= 0 && opts[prev].disabled) prev--;
        if (prev >= 0) this.activeIndex.set(prev);
        break;
      }
      case 'Enter': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openPanel();
          return;
        }
        const active = this.activeIndex();
        if (active >= 0 && active < opts.length) {
          this.selectOption(opts[active]);
        }
        break;
      }
      case 'Escape':
      case 'Tab': {
        this.closePanel();
        break;
      }
    }
  }

  private optionValueEquals(a: unknown, b: unknown): boolean {
    return Object.is(a, b);
  }

  private emitSearch(query: string): void {
    if (query.length < this.minSearchLength()) return;

    const debounce = this.debounceMs();
    if (this.searchDebounceTimer != null) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }

    if (debounce <= 0) {
      this.onSearch.emit(query);
      return;
    }

    this.searchDebounceTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.onSearch.emit(query);
        this.cdr.markForCheck();
      });
      this.searchDebounceTimer = null;
    }, debounce);
  }

  private openPanel(): void {
    if (this.overlayRef || this.isDisabled()) return;
    if (this.searchQuery().length < this.minSearchLength()) return;

    const trigger = this.elRef.nativeElement.querySelector('input[role="combobox"]') as HTMLElement;
    if (!trigger) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
      ])
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      width: trigger.offsetWidth
    });

    const portal = new TemplatePortal(this.panelTemplate(), this.vcr);
    this.overlayRef.attach(portal);

    const pane = this.overlayRef.overlayElement;
    this.outsideSub = new Subscription();

    this.outsideSub.add(
      fromEvent<PointerEvent>(document, 'pointerdown', { capture: true }).subscribe(ev => {
        const t = ev.target as Node;
        if (this.elRef.nativeElement.contains(t) || pane.contains(t)) return;
        this.closePanel();
      })
    );

    this.outsideSub.add(
      fromEvent<KeyboardEvent>(document, 'keydown').subscribe(ev => {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          this.closePanel();
        }
      })
    );

    this.isOpen.set(true);

    const opts = this.filteredOptions();
    const v = this.value();
    let initial = -1;
    if (v != null) {
      initial = opts.findIndex(o => this.optionValueEquals(o.value, v));
    }
    this.activeIndex.set(initial >= 0 ? initial : -1);
  }

  private closePanel(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.outsideSub?.unsubscribe();
    this.outsideSub = null;
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }
}
