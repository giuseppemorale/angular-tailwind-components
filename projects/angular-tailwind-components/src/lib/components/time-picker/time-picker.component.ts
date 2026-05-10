import { Component, computed, ElementRef, forwardRef, HostListener, inject, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TAILWIND_DATETIME_LANGUAGE } from '../../tokens/tokens';
import { TailwindComponent } from '../tailwind.component';

type Lang = 'it' | 'en';
type TimeDraft = { h: number; m: number };

const I18N: Record<Lang, { placeholder: string; now: string; apply: string }> = {
  it: { placeholder: 'Seleziona ora', now: 'Adesso', apply: 'Applica' },
  en: { placeholder: 'Select time', now: 'Now', apply: 'Apply' }
};

@Component({
  selector: 'tailwind-time-picker',
  imports: [],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TailwindTimePicker), multi: true }],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css'
})
export class TailwindTimePicker extends TailwindComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly lang: Lang = inject(TAILWIND_DATETIME_LANGUAGE, { optional: true }) ?? 'it';

  protected readonly i18n = I18N[this.lang];
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly minutes = Array.from({ length: 60 }, (_, i) => i);

  readonly label = input<string>('');
  readonly value = model<string>('');
  readonly isDisabled = signal(false);
  readonly showPanel = signal(false);
  readonly draft = signal<TimeDraft | null>(null);

  readonly displayValue = computed(() => this.value());

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(d: boolean): void {
    this.isDisabled.set(d);
  }

  togglePanel(): void {
    if (this.isDisabled()) return;
    const opening = !this.showPanel();
    if (opening) {
      const v = this.value();
      const parts = v ? v.split(':') : null;
      const now = new Date();
      this.draft.set({
        h: parts ? parseInt(parts[0], 10) || 0 : now.getHours(),
        m: parts ? parseInt(parts[1], 10) || 0 : now.getMinutes()
      });
    }
    this.showPanel.set(opening);
  }

  apply(): void {
    const d = this.draft();
    if (!d) return;
    const val = `${d.h.toString().padStart(2, '0')}:${d.m.toString().padStart(2, '0')}`;
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
    this.showPanel.set(false);
  }

  goToNow(): void {
    const now = new Date();
    this.draft.set({ h: now.getHours(), m: now.getMinutes() });
  }

  onHourChange(e: Event): void {
    const cur = this.draft();
    if (!cur) return;
    this.draft.set({ ...cur, h: Number((e.target as HTMLSelectElement).value) });
  }

  onMinuteChange(e: Event): void {
    const cur = this.draft();
    if (!cur) return;
    this.draft.set({ ...cur, m: Number((e.target as HTMLSelectElement).value) });
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (!this.showPanel()) return;
    const t = event.target;
    if (t instanceof Node && this.host.nativeElement.contains(t)) return;
    this.showPanel.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || !this.showPanel()) return;
    event.stopPropagation();
    this.showPanel.set(false);
  }
}
