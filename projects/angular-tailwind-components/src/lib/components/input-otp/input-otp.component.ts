import {
  Component,
  computed,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChildren,
  ElementRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-input-otp',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindInputOtp),
      multi: true
    }
  ],
  templateUrl: './input-otp.component.html',
  styleUrl: './input-otp.component.css'
})
export class TailwindInputOtp extends TailwindComponent implements ControlValueAccessor {
  /** Label text */
  readonly label = input<string>('');
  /** Number of character slots */
  readonly length = input<number>(6);
  /** Allow only digits */
  readonly integerOnly = input<boolean>(true);
  /** Mask digits (password bullets) */
  readonly mask = input<boolean>(false);
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Slots are read-only (navigation still allowed) */
  readonly readonly = input<boolean>(false);
  /** Helper text shown below */
  readonly helperText = input<string>('');
  /** Error text when hasError is true */
  readonly errorText = input<string>('');
  /** Error state styling */
  readonly hasError = input<boolean>(false);
  /** Accessible label for the group (used when label is empty) */
  readonly ariaLabel = input<string>('Verification code');
  /** Separator string; empty hides */
  readonly separator = input<string>('');
  /** 0-based slot index after which the separator is rendered */
  readonly separatorAfterIndex = input<number | null>(null);
  /** Hint for browsers / SMS autofill (first slot only) */
  readonly autocomplete = input<string>('one-time-code');

  /** Two-way bound full code string */
  readonly value = model<string>('');

  /** Emitted when all slots are filled */
  readonly completed = output<string>();

  readonly isDisabled = signal(false);

  readonly slotIndexes = computed(() => {
    const n = Math.max(1, Math.min(32, Math.floor(this.length())));
    return Array.from({ length: n }, (_, i) => i);
  });

  readonly otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpDigit');

  readonly cellClasses = computed(() => {
    const base = [
      'block w-10 text-center font-mono tabular-nums bg-white',
      'border transition-colors duration-150',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed'
    ];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-1 py-1 rounded-sm min-w-7',
      sm: 'text-sm px-1.5 py-1.5 rounded-md min-w-8',
      md: 'text-sm px-2 py-2 rounded-md min-w-10',
      lg: 'text-base px-2.5 py-2.5 rounded-lg min-w-11',
      xl: 'text-base px-3 py-3 rounded-lg min-w-12'
    };

    const stateClass = this.hasError()
      ? 'border-danger-400 focus:outline-danger-500 text-danger-900'
      : 'border-surface-300 focus:outline-primary-500 text-surface-900';

    return [...base, sizeMap[this.size()], stateClass].join(' ');
  });

  readonly groupAriaLabel = computed(() => this.label() || this.ariaLabel());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(this.normalizeIncoming(value ?? ''));
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  maxSlots(): number {
    return this.slotIndexes().length;
  }

  digitAt(index: number): string {
    return this.value()[index] ?? '';
  }

  showSeparatorAfter(index: number): boolean {
    const sep = this.separator();
    const pos = this.separatorAfterIndex();
    return !!sep && pos !== null && pos === index;
  }

  inputType(): string {
    return this.mask() ? 'password' : 'text';
  }

  inputMode(): 'numeric' | 'text' {
    return this.integerOnly() ? 'numeric' : 'text';
  }

  autocompleteForSlot(index: number): string | null {
    return index === 0 ? this.autocomplete() : null;
  }

  cellId(index: number): string {
    const base = this.id() ?? 'tailwind-input-otp';
    return `${base}-digit-${index}`;
  }

  onSlotFocus(index: number): void {
    this.onTouched();
    const len = this.value().length;
    if (index > len) {
      queueMicrotask(() => this.focusSlot(Math.min(len, this.maxSlots() - 1)));
    }
  }

  onInput(event: Event, index: number): void {
    if (this.readonly()) {
      return;
    }
    const inputEl = event.target as HTMLInputElement;
    let raw = inputEl.value;
    if (this.integerOnly()) {
      raw = raw.replace(/\D/g, '');
    }
    const char = raw.slice(-1);

    let v = this.value();
    const max = this.maxSlots();

    if (char && index > v.length) {
      queueMicrotask(() => this.focusSlot(v.length));
      inputEl.value = this.digitAt(index);
      return;
    }

    if (!char) {
      if (index < v.length) {
        v = v.slice(0, index) + v.slice(index + 1);
      }
    } else {
      if (index < v.length) {
        v = v.slice(0, index) + char + v.slice(index + 1);
      } else if (index === v.length) {
        v = v + char;
      }
      v = v.slice(0, max);
    }

    v = this.normalizeIncoming(v);
    this.commit(v);

    queueMicrotask(() => {
      inputEl.value = this.digitAt(index);
      if (char && index < max - 1) {
        this.focusSlot(index + 1);
      }
    });
  }

  onPaste(event: ClipboardEvent, index: number): void {
    if (this.readonly() || this.isDisabled()) {
      return;
    }
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    let cleaned = this.integerOnly() ? text.replace(/\D/g, '') : text.replace(/\s/g, '');
    const max = this.maxSlots();
    cleaned = cleaned.slice(0, max - index);
    const merged = this.normalizeIncoming(this.value().slice(0, index) + cleaned);
    this.commit(merged);

    queueMicrotask(() =>
      this.focusSlot(cleaned.length ? Math.min(index + cleaned.length - 1, max - 1) : index)
    );
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const max = this.maxSlots();
    const v = this.value();

    if (event.key === 'Backspace') {
      const cur = this.digitAt(index);
      if (!cur && index > 0) {
        event.preventDefault();
        const nextVal = this.normalizeIncoming(v.slice(0, index - 1) + v.slice(index));
        this.commit(nextVal);
        queueMicrotask(() => this.focusSlot(index - 1));
      } else if (cur) {
        event.preventDefault();
        const nextVal = this.normalizeIncoming(v.slice(0, index) + v.slice(index + 1));
        this.commit(nextVal);
        queueMicrotask(() => {
          const el = this.otpInputs()[index]?.nativeElement;
          if (el) {
            el.value = this.digitAt(index);
          }
        });
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusSlot(index - 1);
    } else if (event.key === 'ArrowRight' && index < max - 1) {
      event.preventDefault();
      this.focusSlot(index + 1);
    }
  }

  private commit(joined: string): void {
    const prev = this.value();
    this.value.set(joined);
    this.onChange(joined);
    const max = this.maxSlots();
    if (joined.length === max && prev.length !== max) {
      this.completed.emit(joined);
    }
  }

  private normalizeIncoming(v: string): string {
    const max = Math.max(1, Math.min(32, Math.floor(this.length())));
    let s = v ?? '';
    if (this.integerOnly()) {
      s = s.replace(/\D/g, '');
    }
    return s.slice(0, max);
  }

  private focusSlot(index: number): void {
    queueMicrotask(() => {
      const list = this.otpInputs();
      const el = list[index]?.nativeElement;
      el?.focus();
      el?.select();
    });
  }
}
