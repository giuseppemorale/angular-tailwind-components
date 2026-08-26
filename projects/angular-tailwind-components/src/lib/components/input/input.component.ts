import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  signal,
  untracked
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindSafeHtmlPipe } from '../../pipes/safehtml/safehtml.pipe';
import { TAILWIND_COMPONENTS_SIZE, TAILWIND_LABELS } from '../../tokens';
import { FIELD_BASE, FIELD_SIZE, FIELD_STATE, FIELD_STATE_INVALID } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';
import type { TailwindHeroicon } from '../../models';

@Component({
  imports: [TailwindSafeHtmlPipe, TailwindIcon],
  selector: 'tailwind-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindInput),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindInput extends TailwindComponent implements ControlValueAccessor {
  private readonly defaultSize = inject(TAILWIND_COMPONENTS_SIZE, { optional: true });
  private readonly labels = inject(TAILWIND_LABELS);
  private readonly injector = inject(Injector);

  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Input type */
  readonly type = input<'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'>('text');
  /** Size variant */
  readonly size = input<TailwindSize>(this.defaultSize ?? 'md');
  /** Whether the input is readonly */
  readonly readonly = input<boolean>(false);
  /** Helper text shown below input */
  readonly helperText = input<string>('');
  /** Error text shown when hasError is true */
  readonly errorText = input<string>('');
  /**
   * Forces the error state. Left unset, the field derives it from the bound form control
   * (invalid **and** touched), so the common case needs no wiring at all.
   */
  readonly hasError = input<boolean | undefined>(undefined);

  /** Marks the field required: adds the native attribute, `aria-required`, and an asterisk. */
  readonly required = input<boolean>(false);
  /** Shows a clear button while the field has a value. */
  readonly clearable = input<boolean>(false);
  /** Icon rendered inside the field, before the text. */
  readonly prefixIcon = input<TailwindHeroicon | undefined>(undefined);
  /** Icon rendered inside the field, after the text. */
  readonly suffixIcon = input<TailwindHeroicon | undefined>(undefined);

  // ── Native attributes the consumer could not reach before ──────────────────
  /** `autocomplete` attribute, e.g. `email`, `current-password`, `off`. */
  readonly autocomplete = input<string | undefined>(undefined);
  /** `name` attribute, used by native form submission and password managers. */
  readonly name = input<string | undefined>(undefined);
  /** `inputmode` attribute, which picks the on-screen keyboard on touch devices. */
  readonly inputmode = input<string | undefined>(undefined);
  /** `maxlength` attribute; also drives the character counter when `showCounter` is set. */
  readonly maxlength = input<number | undefined>(undefined);
  /** `minlength` attribute; native validation only. */
  readonly minlength = input<number | undefined>(undefined);
  /** `min` / `max` / `step` for `type="number"`. */
  readonly min = input<number | string | undefined>(undefined);
  /** Upper bound for `type="number"`. */
  readonly max = input<number | string | undefined>(undefined);
  /** Step increment for `type="number"`. */
  readonly step = input<number | string | undefined>(undefined);
  /** `pattern` attribute for native validation. */
  readonly pattern = input<string | undefined>(undefined);
  /** Shows a `current / maxlength` counter under the field. */
  readonly showCounter = input<boolean>(false);

  /** Two-way bound value */
  readonly value = model<string>('');

  /** Internal disabled state */
  readonly isDisabled = signal(false);

  /**
   * The bound `NgControl`, when the field is used with `formControl`, `formControlName` or `ngModel`.
   * Resolved lazily because the control is only wired up after this component is constructed.
   */
  private readonly ngControl = signal<NgControl | null>(null);
  /** Bumped on every blur and value change so the derived error state re-evaluates. */
  private readonly controlStateVersion = signal(0);

  constructor() {
    super();
    // Reading NgControl in the constructor would be a circular dependency (it needs the CVA).
    effect(() => {
      if (this.ngControl()) return;
      untracked(() => this.ngControl.set(this.injector.get(NgControl, null, { optional: true, self: true })));
    });
  }

  /** `true` when the field should paint its error state. */
  readonly isInvalid = computed(() => {
    const explicit = this.hasError();
    if (explicit !== undefined) return explicit;

    this.controlStateVersion();
    const control = this.ngControl();
    return !!control && control.invalid === true && (control.touched === true || control.dirty === true);
  });

  readonly clearLabel = computed(() => this.labels.clear);
  readonly showClear = computed(() => this.clearable() && !!this.value() && !this.isDisabled() && !this.readonly());
  protected readonly hasPrefix = computed(() => !!this.prefixIcon());
  protected readonly hasSuffix = computed(() => !!this.suffixIcon() || this.showClear());

  /** `true` when a counter can be shown, i.e. `showCounter` is on and there is a limit to count against. */
  protected readonly hasCounter = computed(() => this.showCounter() && this.maxlength() !== undefined);

  readonly counterText = computed(() => {
    const max = this.maxlength();
    return max === undefined ? '' : `${this.value().length} / ${max}`;
  });

  /**
   * Every description the field currently shows, so the screen reader announces the helper text,
   * the error and the counter rather than only the first of them.
   */
  protected readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.errorText() && this.isInvalid()) ids.push(this.subId('error'));
    else if (this.helperText()) ids.push(this.subId('helper'));
    if (this.hasCounter()) ids.push(this.subId('counter'));
    return ids.length ? ids.join(' ') : null;
  });

  /** Computed input classes */
  readonly inputClasses = computed(() => {
    const stateClass = this.isInvalid() ? FIELD_STATE_INVALID : FIELD_STATE;

    // Leave room for the icons rendered on top of the field.
    const affixPadding = [this.hasPrefix() ? 'pl-9' : '', this.hasSuffix() ? 'pr-9' : ''].filter(Boolean).join(' ');

    return ['block', FIELD_BASE, FIELD_SIZE[this.size()], stateClass, affixPadding].filter(Boolean).join(' ');
  });

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
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

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val);
    this.controlStateVersion.update(v => v + 1);
  }

  onBlur(): void {
    this.onTouched();
    this.controlStateVersion.update(v => v + 1);
  }

  /** Clears the field and notifies the form, as if the user had emptied it. */
  clear(): void {
    if (this.isDisabled() || this.readonly()) return;
    this.value.set('');
    this.onChange('');
    this.onTouched();
    this.controlStateVersion.update(v => v + 1);
  }
}
