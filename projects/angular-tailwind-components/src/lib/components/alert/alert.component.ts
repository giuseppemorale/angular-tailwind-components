import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindColor, TailwindVariantKind } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { SEMANTIC_BORDER, semanticFill } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon, TailwindButton],
  selector: 'tailwind-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindAlert extends TailwindComponent {
  private readonly labels = inject(TAILWIND_LABELS);

  /** Accessible name override; defaults to `TAILWIND_LABELS.dismiss`. */
  readonly dismissAriaLabel = input<string>('');
  protected readonly dismissLabel = computed(() => this.dismissAriaLabel() || this.labels.dismiss);

  /** Semantic color */
  readonly color = input<TailwindColor>('info');
  /** How the surface is painted; `soft` (default) is the alert's long-standing look. */
  readonly kind = input<TailwindVariantKind>('soft');
  /** Alert title */
  readonly title = input<string>('');
  /** Whether the alert can be dismissed */
  readonly dismissible = input<boolean>(false);
  /** Whether to show a border on the left */
  readonly bordered = input<boolean>(true);
  /** Renders the projected `[tailwind-alert-actions]` slot below the message */
  readonly showActions = input<boolean>(false);

  /** Emitted when the alert is dismissed */
  readonly dismissed = output<void>();

  /** Internal dismissed state */
  readonly isDismissed = signal(false);

  readonly computedClasses = computed(() => {
    const color = this.color();
    // Fill and border are taken separately: in `bordered` mode the border is a left accent stripe
    // that keeps the semantic color even when the fill is `solid`.
    return this.mergeClasses(
      'flex gap-3 p-4 rounded-surface',
      semanticFill(this.kind(), color),
      SEMANTIC_BORDER[color],
      this.bordered() ? 'border-l-4' : 'border'
    );
  });

  dismiss(): void {
    this.isDismissed.set(true);
    this.dismissed.emit();
  }
}
