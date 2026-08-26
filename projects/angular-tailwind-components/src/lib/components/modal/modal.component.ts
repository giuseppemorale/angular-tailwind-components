import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TailwindSize } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

/** Exit animation duration, kept in sync with the panel transition in the template. */
const EXIT_ANIMATION_MS = 200;

/**
 * Panel width per size, matching the Tailwind `max-w-*` scale the modal used before.
 * Applied to the overlay pane rather than the panel, because the pane is what the global position
 * strategy sizes and centres.
 */
const SIZE_MAX_WIDTH: Record<TailwindSize, string> = {
  xs: '24rem',
  sm: '28rem',
  md: '32rem',
  lg: '42rem',
  xl: '56rem'
};

@Component({
  imports: [TailwindButton, CdkTrapFocus],
  selector: 'tailwind-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindModal extends TailwindComponent {
  private readonly document = inject(DOCUMENT);
  private readonly labels = inject(TAILWIND_LABELS);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Whether to show close button in header */
  readonly showCloseButton = input<boolean>(true);
  /** Whether clicking backdrop closes the modal */
  readonly closeOnBackdrop = input<boolean>(true);
  /** Whether pressing Escape closes the modal */
  readonly closeOnEscape = input<boolean>(true);
  /** Accessible name of the close button; defaults to the app-wide `TAILWIND_LABELS.close`. */
  readonly closeLabel = input<string>('');

  /** Open/close state */
  readonly isOpen = signal(false);
  /** Visibility for animation */
  readonly isVisible = signal(false);

  /** Emitted when the modal is fully closed (after exit animation) */
  readonly closed = output<void>();

  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private readonly modalPanel = viewChild<ElementRef<HTMLElement>>('modalPanel');

  private overlayRef: OverlayRef | null = null;
  private overlaySub: Subscription | null = null;
  private exitTimeout: ReturnType<typeof setTimeout> | undefined;
  /** Element focused before opening, refocused on close so keyboard users keep their place. */
  private previouslyFocused: HTMLElement | null = null;

  readonly resolvedCloseLabel = computed(() => this.closeLabel() || this.labels.close);

  readonly panelClasses = computed(() =>
    this.mergeClasses(
      'relative bg-surface rounded-overlay shadow-2xl animate-overlay-scale',
      'w-full transform transition-all duration-200',
      this.isVisible() ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    )
  );

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.exitTimeout);
      this.disposeOverlay();
    });
  }

  /** Open the modal */
  open(): void {
    if (this.isOpen()) return;

    const active = this.document.activeElement;
    this.previouslyFocused = active instanceof HTMLElement ? active : null;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      // CDK's block strategy already no-ops when another overlay has the page blocked,
      // so stacked dialogs restore scrolling exactly once.
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: ['tailwind-modal-backdrop', 'cdk-overlay-dark-backdrop'],
      panelClass: 'tailwind-modal-pane',
      width: '100%',
      maxWidth: SIZE_MAX_WIDTH[this.size()]
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.isOpen.set(true);

    this.overlaySub = new Subscription();
    this.overlaySub.add(
      this.overlayRef.backdropClick().subscribe(() => {
        if (this.closeOnBackdrop()) this.close();
      })
    );
    this.overlaySub.add(
      this.overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape' && this.closeOnEscape()) {
          event.preventDefault();
          this.close();
        }
      })
    );

    requestAnimationFrame(() => {
      this.isVisible.set(true);
      this.modalPanel()?.nativeElement?.focus();
    });
  }

  /** Close the modal (plays exit animation then emits onClose) */
  close(): void {
    if (!this.isOpen()) return;

    this.isVisible.set(false);
    clearTimeout(this.exitTimeout);
    this.exitTimeout = setTimeout(() => {
      this.disposeOverlay();
      this.isOpen.set(false);
      this.previouslyFocused?.focus();
      this.previouslyFocused = null;
      this.closed.emit();
    }, EXIT_ANIMATION_MS);
  }

  private disposeOverlay(): void {
    this.overlaySub?.unsubscribe();
    this.overlaySub = null;
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
