import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  OnDestroy,
  signal,
  TemplateRef,
  ViewContainerRef,
  viewChild
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { fromEvent, Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindOption, TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindSelect),
      multi: true
    }
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class TailwindSelect<T = unknown> extends TailwindComponent implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');

  private overlayRef: OverlayRef | null = null;
  private outsideSub: Subscription | null = null;

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
  /** When true, value is `T[]` and several options can be selected */
  readonly multiple = input(false);

  /** Selected value: `T | null` when single, `T[]` when `multiple` */
  readonly value = model<T | T[] | null>(null);

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Whether the dropdown panel is open */
  readonly isOpen = signal(false);

  /** Keyboard-highlighted option index (-1 = none) */
  readonly activeIndex = signal(-1);

  /** The currently selected option object (single mode only) */
  readonly selectedOption = computed(() => {
    if (this.multiple()) return null;
    const v = this.value();
    if (v == null || Array.isArray(v)) return null;
    return this.options().find(o => this.optionValueEquals(o.value, v)) ?? null;
  });

  /** Selected option objects in `options()` order (multiple mode only) */
  readonly selectedOptions = computed(() => {
    if (!this.multiple()) return [];
    const v = this.value();
    const arr = Array.isArray(v) ? v : [];
    return this.options().filter(o => arr.some(sv => this.optionValueEquals(o.value, sv)));
  });

  /** Classes for the trigger button */
  readonly triggerClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-1 rounded-sm',
      sm: 'text-sm px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-3 py-2 rounded-md',
      lg: 'text-base px-3.5 py-2.5 rounded-lg',
      xl: 'text-base px-4 py-3 rounded-lg'
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-surface-300 focus:outline-primary-500';

    const layout = this.multiple() ? 'items-start' : 'items-center';

    return [
      'flex justify-between w-full bg-white border transition-colors duration-150',
      layout,
      'pr-3 cursor-pointer text-left',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
      sizeMap[this.size()],
      stateClass
    ].join(' ');
  });

  private optionValueEquals(a: unknown, b: unknown): boolean {
    return Object.is(a, b);
  }

  /** Used in the template to compare option values */
  isOptionSelected(option: TailwindOption<T>): boolean {
    if (this.multiple()) {
      const v = this.value();
      const arr = Array.isArray(v) ? v : [];
      return arr.some(sv => this.optionValueEquals(option.value, sv));
    }
    const v = this.value();
    if (v == null || Array.isArray(v)) return false;
    return this.optionValueEquals(option.value, v);
  }

  /** Classes for a single option row */
  optionClasses(index: number, option: TailwindOption<T>): string {
    const isSelected = this.isOptionSelected(option);
    const isActive = this.activeIndex() === index;
    const isDisabled = !!option.disabled;

    return [
      'flex items-center justify-between px-3 py-2 text-sm cursor-pointer select-none',
      isDisabled
        ? 'text-surface-400 cursor-not-allowed'
        : isSelected
          ? 'bg-primary-50 text-primary-700 font-medium'
          : isActive
            ? 'bg-surface-100 text-surface-900'
            : 'text-surface-800 hover:bg-surface-50'
    ].join(' ');
  }

  // CVA
  private onChange: (value: T | T[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T | T[] | null | undefined): void {
    if (this.multiple()) {
      if (value == null) this.value.set([]);
      else this.value.set(Array.isArray(value) ? [...value] : []);
    } else {
      if (Array.isArray(value)) this.value.set(null);
      else this.value.set(value ?? null);
    }
  }

  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  private openDropdown(): void {
    if (this.overlayRef) return;

    const trigger =
      (this.elRef.nativeElement.querySelector('button[role="combobox"]') as HTMLElement) ?? this.elRef.nativeElement;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions([
        // Preferred: open downward
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
        // Fallback: open upward
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' }
      ])
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      width: trigger.offsetWidth,
      minWidth: 'w-full'
    });

    const portal = new TemplatePortal(this.panelTemplate(), this.vcr);
    this.overlayRef.attach(portal);

    const pane = this.overlayRef.overlayElement;
    this.outsideSub = new Subscription();

    // Close on outside click (capture: trigger + panel are excluded; avoids CDK edge cases)
    this.outsideSub.add(
      fromEvent<PointerEvent>(document, 'pointerdown', { capture: true }).subscribe(ev => {
        const t = ev.target as Node;
        if (this.elRef.nativeElement.contains(t) || pane.contains(t)) return;
        this.closeDropdown();
      })
    );

    this.outsideSub.add(
      fromEvent<KeyboardEvent>(document, 'keydown').subscribe(ev => {
        if (ev.key === 'Escape') {
          ev.preventDefault();
          this.closeDropdown();
        }
      })
    );

    this.isOpen.set(true);

    const opts = this.options();
    let initial = -1;
    if (this.multiple()) {
      const v = this.value();
      const arr = Array.isArray(v) ? v : [];
      initial = opts.findIndex(o => arr.some(sv => this.optionValueEquals(o.value, sv)));
    } else {
      const v = this.value();
      if (v != null && !Array.isArray(v)) {
        initial = opts.findIndex(o => this.optionValueEquals(o.value, v));
      }
    }
    this.activeIndex.set(initial >= 0 ? initial : -1);
  }

  private closeDropdown(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.outsideSub?.unsubscribe();
    this.outsideSub = null;
    this.isOpen.set(false);
    this.activeIndex.set(-1);
  }

  toggleDropdown(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  selectOption(option: TailwindOption<T>): void {
    if (option.disabled) return;
    if (this.multiple()) {
      const v = this.value();
      const current = Array.isArray(v) ? [...v] : [];
      const idx = current.findIndex(sv => this.optionValueEquals(sv, option.value));
      if (idx >= 0) current.splice(idx, 1);
      else current.push(option.value);
      this.value.set(current);
      this.onChange(current);
      this.onTouched();
      return;
    }
    const val = option.value;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
    this.closeDropdown();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    const opts = this.options();

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
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
          this.openDropdown();
          return;
        }
        let prev = this.activeIndex() - 1;
        while (prev >= 0 && opts[prev].disabled) prev--;
        if (prev >= 0) this.activeIndex.set(prev);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
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
        this.closeDropdown();
        break;
      }
    }
  }
}
