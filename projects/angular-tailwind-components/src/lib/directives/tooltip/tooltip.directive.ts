import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TailwindTooltip } from '../../components/tooltip/tooltip.component';
import { TailwindPosition } from '../../models';
import { resolveOverlayAnchor } from '../../util/overlay-anchor';
import { FALLBACK_ORDER, HIDE_DELAY_MS, POSITIONS, SHOW_DELAY_MS } from './properties/constant';

@Directive({
  // `[tooltip]` is the original, unprefixed selector and stays supported; `[tailwindTooltip]` is the
  // prefixed one new code should use, so the directive cannot collide with another library's.
  selector: '[tooltip], [tailwindTooltip]',
  standalone: true
})
export class TailwindTooltipDirective {
  /** Tooltip text, bound through the unprefixed selector `[tooltip]`. */
  readonly tooltip = input<string>('');
  /** Tooltip text, bound through the prefixed selector `[tailwindTooltip]`. */
  readonly tailwindTooltip = input<string>('');
  /** Preferred position; the overlay flips to the opposite side when it would leave the viewport. */
  readonly tooltipPosition = input<TailwindPosition>('top');

  /** Text actually rendered: either selector may carry it, the prefixed one wins when both are set. */
  private readonly text = computed(() => this.tailwindTooltip() || this.tooltip());

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly el = inject(ElementRef);

  private overlayRef: OverlayRef | null = null;
  private componentRef: ComponentRef<TailwindTooltip> | null = null;
  private positionSub: Subscription | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  private get host(): HTMLElement {
    return this.el.nativeElement;
  }

  /**
   * Component hosts such as `tailwind-button` forward their children and have no box, so the
   * overlay is anchored to the control inside instead of an empty rect.
   */
  private get anchor(): HTMLElement {
    return resolveOverlayAnchor(this.host);
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.clearTimeouts();
      this.destroyOverlay();
    });
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  show(): void {
    if (!this.text().trim()) return;

    this.clearHideTimeout();
    if (this.overlayRef) {
      this.componentRef?.instance.show();
      return;
    }
    if (this.showTimeout) return;

    this.showTimeout = setTimeout(() => {
      this.showTimeout = null;
      this.createOverlay();
    }, SHOW_DELAY_MS);
  }

  @HostListener('mouseleave')
  hideFromPointer(): void {
    this.hide();
  }

  /** WCAG 1.4.13: content shown on hover or focus must be dismissible without moving the pointer. */
  @HostListener('document:keydown.escape')
  hideFromEscape(): void {
    if (this.overlayRef) {
      this.clearTimeouts();
      this.destroyOverlay();
    }
  }

  @HostListener('focusout', ['$event'])
  hideFromFocus(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (related && this.host.contains(related)) return;

    queueMicrotask(() => {
      if (!this.host.contains(this.host.ownerDocument.activeElement)) {
        this.hide();
      }
    });
  }

  private hide(): void {
    this.clearShowTimeout();
    if (!this.overlayRef) return;

    this.componentRef?.instance.hide();
    this.hideTimeout = setTimeout(() => {
      this.hideTimeout = null;
      this.destroyOverlay();
    }, HIDE_DELAY_MS);
  }

  private createOverlay(): void {
    const preferred = this.tooltipPosition();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.anchor)
      .withPositions(FALLBACK_ORDER[preferred].map(side => POSITIONS[side]))
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      // The pane must not swallow clicks aimed at the page behind the tooltip.
      hasBackdrop: false,
      panelClass: 'tailwind-tooltip-pane'
    });

    this.componentRef = this.overlayRef.attach(new ComponentPortal(TailwindTooltip, this.viewContainerRef));
    this.componentRef.setInput('text', this.text());
    this.componentRef.setInput('position', preferred);

    // Keep the arrow pointing at the trigger when the overlay flips to a fallback position.
    this.positionSub = positionStrategy.positionChanges.subscribe(change => {
      const side = this.sideOf(change.connectionPair);
      if (side) this.componentRef?.setInput('position', side);
    });

    // The tooltip itself must stay hoverable, so pointing at it cancels the pending hide.
    const pane = this.overlayRef.overlayElement;
    pane.addEventListener('mouseenter', this.onPaneEnter);
    pane.addEventListener('mouseleave', this.onPaneLeave);

    // Without this the trigger has no programmatic link to the text it just revealed.
    this.anchor.setAttribute('aria-describedby', this.componentRef.instance.elementId());
    this.componentRef.instance.show();
  }

  private readonly onPaneEnter = (): void => this.clearHideTimeout();
  private readonly onPaneLeave = (): void => this.hide();

  /** Maps a resolved CDK position back to the side the tooltip ended up on. */
  private sideOf(pair: ConnectedPosition): TailwindPosition | null {
    if (pair.overlayY === 'bottom' && pair.originY === 'top') return 'top';
    if (pair.overlayY === 'top' && pair.originY === 'bottom') return 'bottom';
    if (pair.overlayX === 'end' && pair.originX === 'start') return 'left';
    if (pair.overlayX === 'start' && pair.originX === 'end') return 'right';
    return null;
  }

  private destroyOverlay(): void {
    this.anchor.removeAttribute('aria-describedby');
    this.positionSub?.unsubscribe();
    this.positionSub = null;

    if (this.overlayRef) {
      const pane = this.overlayRef.overlayElement;
      pane.removeEventListener('mouseenter', this.onPaneEnter);
      pane.removeEventListener('mouseleave', this.onPaneLeave);
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.componentRef = null;
  }

  private clearTimeouts(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  private clearShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}
