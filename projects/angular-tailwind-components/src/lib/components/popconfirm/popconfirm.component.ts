import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
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
import { TailwindColor, TailwindPosition } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { resolveOverlayAnchor } from '../../util/overlay-anchor';
import { TailwindComponent } from '../tailwind.component';

const OFFSET_PX = 8;

const POSITIONS: Record<TailwindPosition, ConnectedPosition> = {
  top: { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -OFFSET_PX },
  bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: OFFSET_PX },
  left: { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -OFFSET_PX },
  right: { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: OFFSET_PX }
};

/**
 * Inline confirmation anchored to the control that triggered it — "Delete this row?" with Yes/No,
 * without the weight of a full modal.
 *
 * A modal is the right tool for a decision that deserves the whole screen; for a per-row delete it
 * is disruptive. This keeps focus near the action, traps nothing, and closes on Escape.
 */
@Component({
  imports: [TailwindButton],
  selector: 'tailwind-popconfirm',
  templateUrl: './popconfirm.component.html',
  styleUrl: './popconfirm.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindPopconfirm extends TailwindComponent {
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly labels = inject(TAILWIND_LABELS);

  /** Question shown to the user. */
  readonly message = input<string>('');
  /** Preferred side; flips when it would leave the viewport. */
  readonly position = input<TailwindPosition>('top');
  /** Colour of the confirm button — `danger` for destructive actions. */
  readonly confirmColor = input<TailwindColor>('danger');
  /** Confirm button text; defaults to `TAILWIND_LABELS.confirm`. */
  readonly confirmLabel = input<string>('');
  /** Cancel button text; defaults to `TAILWIND_LABELS.cancel`. */
  readonly cancelLabel = input<string>('');

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly isOpen = signal(false);

  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private anchorEl: HTMLElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private overlaySub: Subscription | null = null;

  protected readonly confirmText = computed(() => this.confirmLabel() || this.labels.confirm);
  protected readonly cancelText = computed(() => this.cancelLabel() || this.labels.cancel);

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.disposeOverlay());
  }

  open(anchor?: Event | HTMLElement): void {
    if (anchor !== undefined) this.storeAnchor(anchor);
    if (!this.anchorEl || this.isOpen()) return;

    const preferred = this.position();
    const order: TailwindPosition[] = [preferred, ...(['top', 'bottom', 'right', 'left'] as TailwindPosition[])];
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.anchorEl)
        .withPositions(order.map(side => POSITIONS[side]))
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'tailwind-popconfirm-pane'
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.isOpen.set(true);

    const anchorEl = this.anchorEl;
    this.overlaySub = new Subscription();
    this.overlaySub.add(
      this.overlayRef.outsidePointerEvents().subscribe(event => {
        const target = event.target as Node | null;
        if (target && anchorEl.contains(target)) return;
        this.cancel();
      })
    );
    this.overlaySub.add(
      this.overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.cancel();
        }
      })
    );

    // Focus the safe choice first: a stray Enter should not confirm a destructive action.
    requestAnimationFrame(() => this.panelRef()?.nativeElement.querySelector('button')?.focus());
  }

  toggle(anchor?: Event | HTMLElement): void {
    if (this.isOpen()) this.cancel();
    else this.open(anchor);
  }

  confirm(): void {
    if (!this.isOpen()) return;
    this.dismiss();
    this.confirmed.emit();
  }

  cancel(): void {
    if (!this.isOpen()) return;
    this.dismiss();
    this.cancelled.emit();
  }

  private dismiss(): void {
    const restoreFocus = this.panelRef()?.nativeElement.contains(this.document.activeElement) ?? false;
    this.disposeOverlay();
    this.isOpen.set(false);
    if (restoreFocus) this.anchorEl?.focus();
  }

  private storeAnchor(anchor: Event | HTMLElement): void {
    // The consumer binds the trigger on a component host, so `currentTarget` is often an element
    // with no box, no role and no focus. Measure, describe and restore focus to the control inside.
    if (anchor instanceof HTMLElement) {
      this.anchorEl = resolveOverlayAnchor(anchor);
      return;
    }
    const target = anchor.currentTarget;
    if (target instanceof HTMLElement) this.anchorEl = resolveOverlayAnchor(target);
  }

  private disposeOverlay(): void {
    this.overlaySub?.unsubscribe();
    this.overlaySub = null;
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
