import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
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
import { TailwindPosition } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { resolveOverlayAnchor } from '../../util/overlay-anchor';
import { TailwindComponent } from '../tailwind.component';
import { FALLBACK_ORDER, POSITIONS } from './properties/constant';

/**
 * A panel of arbitrary content anchored to a trigger, positioned by the CDK overlay.
 *
 * ```html
 * <button type="button" #trigger (click)="popover.toggle(trigger)">Details</button>
 * <tailwind-popover #popover><p>Anything at all</p></tailwind-popover>
 * ```
 */
@Component({
  selector: 'tailwind-popover',
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindPopover extends TailwindComponent {
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly labels = inject(TAILWIND_LABELS);

  /** Preferred side; the overlay flips when the panel would leave the viewport. */
  readonly position = input<TailwindPosition>('bottom');
  /** Closes when a pointer goes down outside the panel and its trigger. */
  readonly closeOnOutsideClick = input<boolean>(true);
  /** Closes on Escape. */
  readonly closeOnEscape = input<boolean>(true);
  /** Renders a header row with a close button. */
  readonly showCloseButton = input<boolean>(false);
  /** Optional heading, which also becomes the panel's accessible name. */
  readonly title = input<string>('');
  /** Accessible name when there is no `title`. */
  readonly ariaLabel = input<string>('');

  /** Emitted when the panel opens. */
  readonly opened = output<void>();
  /** Emitted when the panel closes. */
  readonly closed = output<void>();

  readonly isOpen = signal(false);

  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  private anchorEl: HTMLElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private overlaySub: Subscription | null = null;

  protected readonly closeLabel = () => this.labels.close;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.disposeOverlay());
  }

  /** Opens anchored to `anchor`, which can be the click event or the element itself. */
  open(anchor?: Event | HTMLElement): void {
    if (anchor !== undefined) this.storeAnchor(anchor);
    if (!this.anchorEl || this.isOpen()) return;

    const positions = FALLBACK_ORDER[this.position()].map(side => POSITIONS[side]);
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.anchorEl)
        .withPositions(positions)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'tailwind-popover-pane'
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.isOpen.set(true);
    this.markTrigger(true);

    const anchorEl = this.anchorEl;
    this.overlaySub = new Subscription();
    this.overlaySub.add(
      this.overlayRef.outsidePointerEvents().subscribe(event => {
        if (!this.closeOnOutsideClick()) return;
        const target = event.target as Node | null;
        if (target && anchorEl.contains(target)) return;
        this.close();
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

    requestAnimationFrame(() => this.panelRef()?.nativeElement.focus());
    this.opened.emit();
  }

  close(): void {
    if (!this.isOpen()) return;

    const restoreFocus = this.panelRef()?.nativeElement.contains(this.document.activeElement) ?? false;
    this.disposeOverlay();
    this.isOpen.set(false);
    this.markTrigger(false);
    if (restoreFocus) this.anchorEl?.focus();
    this.closed.emit();
  }

  toggle(anchor?: Event | HTMLElement): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    this.open(anchor);
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

  /** Keeps the trigger's expanded state and its link to the panel truthful. */
  private markTrigger(open: boolean): void {
    const anchor = this.anchorEl;
    if (!anchor) return;
    anchor.setAttribute('aria-expanded', String(open));
    if (open) anchor.setAttribute('aria-controls', this.subId('panel'));
    else anchor.removeAttribute('aria-controls');
  }

  private disposeOverlay(): void {
    this.overlaySub?.unsubscribe();
    this.overlaySub = null;
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
