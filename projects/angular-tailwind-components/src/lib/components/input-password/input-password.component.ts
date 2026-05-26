import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
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
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_TAILWIND_PASSWORD_LABELS, TailwindSize } from '../../models';
import { TAILWIND_PASSWORD_LABELS } from '../../tokens';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';
import { computePasswordStrength, passwordStrengthMeterFill } from './password-strength.util';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-input-password',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindInputPassword),
      multi: true
    }
  ],
  templateUrl: './input-password.component.html',
  styleUrl: './input-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindInputPassword extends TailwindComponent implements ControlValueAccessor, OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly themeLabels = inject(TAILWIND_PASSWORD_LABELS, { optional: true });
  private readonly feedbackPanelTemplate = viewChild.required<TemplateRef<unknown>>('feedbackPanelTemplate');

  private feedbackOverlayRef: OverlayRef | null = null;

  /** Label text */
  readonly label = input<string>('');
  /** Placeholder text */
  readonly placeholder = input<string>('');
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Helper text shown below input */
  readonly helperText = input<string>('');
  /** Error text shown when hasError is true */
  readonly errorText = input<string>('');
  /** Whether the input is in error state */
  readonly hasError = input<boolean>(false);
  /** Show strength feedback panel while typing */
  readonly feedback = input<boolean>(false);
  /** Show toggle to reveal/hide password */
  readonly toggleMask = input<boolean>(false);
  /** Override prompt label from theme token */
  readonly promptLabel = input<string | undefined>(undefined);
  /** Override weak strength label from theme token */
  readonly weakLabel = input<string | undefined>(undefined);
  /** Override medium strength label from theme token */
  readonly mediumLabel = input<string | undefined>(undefined);
  /** Override strong strength label from theme token */
  readonly strongLabel = input<string | undefined>(undefined);

  /** Two-way bound value */
  readonly value = model<string>('');

  readonly isDisabled = signal(false);
  readonly masked = signal(true);
  readonly isFocused = signal(false);

  readonly strength = computed(() => computePasswordStrength(this.value()));
  readonly strengthLevel = computed(() => this.strength().level);
  readonly meterFill = computed(() => passwordStrengthMeterFill(this.strengthLevel()));

  readonly showFeedbackPanel = computed(
    () => this.feedback() && this.isFocused() && this.value().length > 0
  );

  readonly resolvedLabels = computed(() => {
    const defaults = this.themeLabels ?? DEFAULT_TAILWIND_PASSWORD_LABELS;
    return {
      prompt: this.promptLabel() ?? defaults.prompt,
      weak: this.weakLabel() ?? defaults.weak,
      medium: this.mediumLabel() ?? defaults.medium,
      strong: this.strongLabel() ?? defaults.strong
    };
  });

  readonly strengthLabel = computed(() => {
    const labels = this.resolvedLabels();
    const level = this.strengthLevel();
    if (level === 'medium') return labels.medium;
    if (level === 'strong') return labels.strong;
    return labels.weak;
  });

  readonly inputType = computed(() => (this.masked() ? 'password' : 'text'));

  readonly inputPaddingClass = computed(() => (this.toggleMask() ? 'pr-10' : ''));

  readonly toggleIcon = computed(() => (this.masked() ? 'eye' : 'eye-slash'));

  readonly toggleAriaLabel = computed(() => (this.masked() ? 'Mostra password' : 'Nascondi password'));

  readonly inputClasses = computed(() => {
    const base = [
      'block w-full bg-white',
      'border transition-colors duration-150',
      'placeholder:text-neutral-400',
      'outline-none focus:outline focus:outline-2 focus:outline-offset-2',
      'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed'
    ];

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

    return [...base, sizeMap[this.size()], stateClass, this.inputPaddingClass()].filter(Boolean).join(' ');
  });

  readonly meterSegmentClasses = computed(() => {
    const fill = this.meterFill();
    const level = this.strengthLevel();
    const activeClass =
      level === 'weak' ? 'bg-danger-500' : level === 'medium' ? 'bg-warning-500' : 'bg-success-600';

    return [0, 1, 2].map(index => {
      const isActive = index < fill;
      return isActive ? activeClass : 'bg-neutral-200';
    });
  });

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnDestroy(): void {
    this.closeFeedbackPanel();
  }

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
    this.syncFeedbackPanel();
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.syncFeedbackPanel();
  }

  onBlur(): void {
    this.isFocused.set(false);
    this.closeFeedbackPanel();
    this.onTouched();
  }

  toggleMaskVisibility(): void {
    this.masked.update(v => !v);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showFeedbackPanel()) {
      this.isFocused.set(false);
    }
  }

  private syncFeedbackPanel(): void {
    if (this.showFeedbackPanel()) {
      queueMicrotask(() => this.openFeedbackPanel());
    } else {
      this.closeFeedbackPanel();
    }
  }

  private openFeedbackPanel(): void {
    if (this.feedbackOverlayRef) {
      return;
    }

    const trigger = this.elRef.nativeElement.querySelector('input');
    if (!trigger) {
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 }
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.feedbackOverlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'tailwind-overlay-popover'
    });

    const portal = new TemplatePortal(this.feedbackPanelTemplate(), this.vcr);
    this.feedbackOverlayRef.attach(portal);
  }

  private closeFeedbackPanel(): void {
    this.feedbackOverlayRef?.detach();
    this.feedbackOverlayRef?.dispose();
    this.feedbackOverlayRef = null;
  }
}
