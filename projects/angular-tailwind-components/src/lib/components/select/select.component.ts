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
import { Subscription } from 'rxjs';
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
  styleUrl: './select.component.scss'
})
export class TailwindSelect<T = unknown> extends TailwindComponent implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly panelTpl = viewChild.required<TemplateRef<unknown>>('panelTpl');

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

  /** Currently selected value */
  readonly value = model<T | null>(null);

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /** Whether the dropdown panel is open */
  readonly isOpen = signal(false);

  /** Keyboard-highlighted option index (-1 = none) */
  readonly activeIndex = signal(-1);

  /** The currently selected option object */
  readonly selectedOption = computed(() => this.options().find(o => String(o.value) === this.value()) ?? null);

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

    return [
      'flex items-center justify-between w-full bg-white border transition-colors duration-150',
      'pr-3 cursor-pointer text-left',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed',
      sizeMap[this.size()],
      stateClass
    ].join(' ');
  });

  /** Used in the template to compare option values */
  isOptionSelected(option: TailwindOption): boolean {
    return String(option.value) === this.value();
  }

  /** Classes for a single option row */
  optionClasses(index: number, option: TailwindOption): string {
    const isSelected = String(option.value) === this.value();
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
  private onChange: (value: T) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value.set(value ?? null);
  }
  registerOnChange(fn: (value: T) => void): void {
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
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        // Fallback: open upward
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
      ])
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      width: trigger.offsetWidth
    });

    const portal = new TemplatePortal(this.panelTpl(), this.vcr);
    this.overlayRef.attach(portal);

    // Close when clicking outside (but not on the trigger itself)
    this.outsideSub = this.overlayRef.outsidePointerEvents().subscribe(event => {
      if (!this.elRef.nativeElement.contains(event.target as Node)) {
        this.closeDropdown();
      }
    });

    this.isOpen.set(true);
    this.activeIndex.set(this.options().findIndex(o => String(o.value) === this.value()));
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
