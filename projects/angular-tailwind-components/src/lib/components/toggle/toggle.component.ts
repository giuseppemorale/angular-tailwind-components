import { Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-toggle',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AtcToggle),
      multi: true,
    },
  ],
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
})
export class AtcToggle implements ControlValueAccessor {
  /** Label text */
  label = input<string>('');
  /** Aria label for accessibility */
  ariaLabel = input<string>('');
  /** Size variant */
  size = input<AtcSize>('md');

  /** Two-way bound checked state */
  checked = model<boolean>(false);

  /** Internal disabled state */
  isDisabled = signal(false);

  /** Track (background) classes */
  trackClasses = computed(() => {
    const sizeMap: Record<AtcSize, string> = {
      xs: 'w-7 h-4',
      sm: 'w-8 h-5',
      md: 'w-11 h-6',
      lg: 'w-14 h-7',
      xl: 'w-16 h-8',
    };

    const base = [
      'relative inline-flex shrink-0 rounded-full',
      'border-2 border-transparent',
      'transition-colors duration-200 ease-in-out',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
      'cursor-pointer disabled:cursor-not-allowed',
    ];

    const stateClass = this.checked()
      ? 'bg-primary-600'
      : 'bg-surface-300';

    return [...base, sizeMap[this.size()], stateClass].join(' ');
  });

  /** Thumb (knob) classes */
  thumbClasses = computed(() => {
    const sizeMap: Record<AtcSize, { thumb: string; translateOn: string }> = {
      xs: { thumb: 'w-3 h-3', translateOn: 'translate-x-3' },
      sm: { thumb: 'w-4 h-4', translateOn: 'translate-x-3' },
      md: { thumb: 'w-5 h-5', translateOn: 'translate-x-5' },
      lg: { thumb: 'w-6 h-6', translateOn: 'translate-x-7' },
      xl: { thumb: 'w-7 h-7', translateOn: 'translate-x-8' },
    };

    const config = sizeMap[this.size()];

    const base = [
      'pointer-events-none inline-block rounded-full',
      'bg-white shadow-md',
      'transform transition-transform duration-200 ease-in-out',
    ];

    const translateClass = this.checked() ? config.translateOn : 'translate-x-0';

    return [...base, config.thumb, translateClass].join(' ');
  });

  // CVA
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  toggle(): void {
    if (this.isDisabled()) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.onChange(newValue);
    this.onTouched();
  }
}
