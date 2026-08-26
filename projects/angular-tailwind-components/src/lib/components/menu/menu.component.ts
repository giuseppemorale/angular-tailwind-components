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
import { TailwindMenuItem, TailwindPosition } from '../../models';
import { resolveOverlayAnchor } from '../../util/overlay-anchor';
import { TailwindComponent } from '../tailwind.component';
import { BELOW, BESIDE, MIN_PANEL_WIDTH_PX } from './properties/constant';

@Component({
  selector: 'tailwind-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindMenu extends TailwindComponent {
  private readonly document = inject(DOCUMENT);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private anchorEl: HTMLElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private closeSub: Subscription | null = null;

  /** Menu entries; supports `divider` and `disabled`. `tooltip` / `tooltipPosition` are read by `tailwind-toolbar`, not here. */
  readonly items = input<TailwindMenuItem[]>([]);
  /** Which edge of the anchor the panel aligns to when it opens below it. */
  readonly align = input<Exclude<TailwindPosition, 'top' | 'bottom'>>('left');
  /** `bottom` opens under the anchor; `right` opens beside it (e.g. vertical toolbar rail). */
  readonly placement = input<Extract<TailwindPosition, 'bottom' | 'right'>>('bottom');

  /** Entry chosen by the user. */
  readonly itemSelect = output<TailwindMenuItem>();

  readonly isOpen = signal(false);

  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.disposeOverlay());
  }

  /**
   * Opens anchored to `anchor`: the click event (`(click)="menu.open($event)"`) or an element.
   * Called without arguments, it reuses the last anchor.
   */
  open(anchor?: Event | HTMLElement): void {
    if (anchor !== undefined) this.storeAnchor(anchor);
    if (!this.anchorEl || this.isOpen()) return;
    this.attachOverlay();
  }

  close(): void {
    if (!this.isOpen()) return;
    // Focus would otherwise land on `<body>` when the panel holding it is removed.
    const restoreFocus = this.panelRef()?.nativeElement.contains(this.document.activeElement) ?? false;
    this.disposeOverlay();
    this.isOpen.set(false);
    if (restoreFocus) this.anchorEl?.focus();
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

  private attachOverlay(): void {
    const anchor = this.anchorEl;
    if (!anchor || this.overlayRef) return;

    const positions = this.placement() === 'right' ? BESIDE : BELOW[this.align()];
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchor)
      .withPositions(positions)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minWidth: Math.max(anchor.offsetWidth, MIN_PANEL_WIDTH_PX)
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.isOpen.set(true);

    this.closeSub = new Subscription();
    // `outsidePointerEvents` fires for the anchor's own click too, which would close the menu the
    // instant it opened; excluding the anchor keeps the toggle working.
    this.closeSub.add(
      this.overlayRef.outsidePointerEvents().subscribe(event => {
        const target = event.target as Node | null;
        if (target && anchor.contains(target)) return;
        this.close();
      })
    );
    this.closeSub.add(
      this.overlayRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.close();
        }
      })
    );
    // The pattern requires focus to move into the menu once it is on screen.
    requestAnimationFrame(() => this.focusFirstItem());
  }

  private disposeOverlay(): void {
    this.closeSub?.unsubscribe();
    this.closeSub = null;
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  selectItem(item: TailwindMenuItem): void {
    if (item.disabled) return;
    const anchor = this.anchorEl;
    this.itemSelect.emit(item);
    this.close();
    anchor?.focus();
  }

  /**
   * Menu keyboard support per the WAI-ARIA Menu pattern: arrows walk the enabled entries (wrapping),
   * Home/End jump to the extremes, Tab closes. Without this a `role="menu"` is unusable by keyboard.
   */
  onPanelKeydown(event: KeyboardEvent): void {
    const step: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
    const items = this.focusableItems();
    if (items.length === 0) return;

    if (event.key === 'Tab') {
      this.close();
      return;
    }

    let target: number;
    if (event.key === 'Home') {
      target = 0;
    } else if (event.key === 'End') {
      target = items.length - 1;
    } else if (event.key in step) {
      const current = items.indexOf(this.document.activeElement as HTMLElement);
      target = (((current + step[event.key]) % items.length) + items.length) % items.length;
    } else {
      return;
    }

    event.preventDefault();
    items[target]?.focus();
  }

  /** Enabled `role="menuitem"` buttons in DOM order. */
  private focusableItems(): HTMLElement[] {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
  }

  private focusFirstItem(): void {
    this.focusableItems()[0]?.focus();
  }
}
