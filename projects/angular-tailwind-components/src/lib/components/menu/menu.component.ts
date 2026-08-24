import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import { TailwindComponent } from '../tailwind.component';
import { TailwindMenuItem, TailwindPosition } from '../../models';

/** Matches previous `min-w-48` floor when the anchor is narrower. */
const MIN_PANEL_WIDTH_PX = 192;

@Component({
  selector: 'tailwind-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindMenu extends TailwindComponent implements OnDestroy, OnInit {
  private readonly document = inject(DOCUMENT);
  private openScheduleId: ReturnType<typeof setTimeout> | undefined;
  private anchorEl: HTMLElement | null = null;

  private readonly onScrollReposition = (): void => {
    if (this.isOpen()) {
      this.updatePanelPosition();
    }
  };

  readonly items = input<TailwindMenuItem[]>([]);
  readonly align = input<Exclude<TailwindPosition, 'top' | 'bottom'>>('left');
  /** `bottom` opens under the anchor; `right` opens beside it (e.g. vertical toolbar rail). */
  readonly placement = input<Extract<TailwindPosition, 'bottom' | 'right'>>('bottom');

  readonly onSelect = output<TailwindMenuItem>();

  readonly isOpen = signal(false);

  /** Popover box in coordinates relative to the `position: fixed` containing block (often viewport, not under transformed Docs wrappers). */
  readonly panelLayout = signal<{
    top: number;
    left?: number;
    right?: number;
    minWidth: number;
  } | null>(null);

  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  ngOnInit(): void {
    this.document.addEventListener('scroll', this.onScrollReposition, true);
  }

  ngOnDestroy(): void {
    this.document.removeEventListener('scroll', this.onScrollReposition, true);
    if (this.openScheduleId != null) {
      clearTimeout(this.openScheduleId);
    }
  }

  /**
   * Opens the menu under `anchor` (toggle element).
   * Pass the click event from the button, e.g. `(click)="menu.open($event)"`, or an `HTMLElement`.
   * After the first open with an anchor, `open()` without arguments reuses the last anchor.
   *
   * Opening is deferred one macrotask so the same `click` is not closed immediately by `document:click`.
   */
  open(anchor?: Event | HTMLElement): void {
    if (anchor !== undefined) {
      this.storeAnchor(anchor);
    }
    if (!this.anchorEl) {
      return;
    }
    if (this.isOpen()) {
      return;
    }
    this.scheduleOpen();
  }

  close(): void {
    if (!this.isOpen()) return;
    // Focus would otherwise land on `<body>` when the panel holding it is removed.
    const restoreFocus = this.panelRef()?.nativeElement.contains(this.document.activeElement) ?? false;
    this.isOpen.set(false);
    this.panelLayout.set(null);
    if (restoreFocus) this.anchorEl?.focus();
  }

  toggle(anchor?: Event | HTMLElement): void {
    if (this.isOpen()) {
      this.close();
      return;
    }
    if (anchor !== undefined) {
      this.storeAnchor(anchor);
    }
    if (!this.anchorEl) {
      return;
    }
    this.scheduleOpen();
  }

  private storeAnchor(anchor: Event | HTMLElement): void {
    if (anchor instanceof HTMLElement) {
      this.anchorEl = anchor;
      return;
    }
    const target = anchor.currentTarget;
    if (target instanceof HTMLElement) {
      this.anchorEl = target;
    }
  }

  private scheduleOpen(): void {
    if (this.openScheduleId != null) {
      clearTimeout(this.openScheduleId);
    }
    this.openScheduleId = setTimeout(() => {
      this.openScheduleId = undefined;
      this.isOpen.set(true);
      this.updatePanelPosition();
      requestAnimationFrame(() => {
        this.updatePanelPosition();
        this.focusFirstItem();
      });
    }, 0);
  }

  private updatePanelPosition(): void {
    const anchor = this.anchorEl;
    if (!anchor) {
      this.panelLayout.set(null);
      return;
    }
    const panelEl = this.panelRef()?.nativeElement;
    const cbRoot = panelEl
      ? this.getFixedPositioningContainingBlock(panelEl)
      : this.getFixedPositioningContainingBlock(anchor);
    const cbRect = cbRoot.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    const minWidth = Math.max(rect.width, MIN_PANEL_WIDTH_PX);

    if (this.placement() === 'right') {
      this.panelLayout.set({
        top: rect.top - cbRect.top,
        left: rect.right - cbRect.left,
        minWidth
      });
      return;
    }

    const top = rect.bottom - cbRect.top;
    if (this.align() === 'right') {
      this.panelLayout.set({
        top,
        right: cbRect.right - rect.right,
        minWidth
      });
    } else {
      this.panelLayout.set({
        top,
        left: rect.left - cbRect.left,
        minWidth
      });
    }
  }

  selectItem(item: TailwindMenuItem): void {
    if (!item.disabled) {
      this.onSelect.emit(item);
      this.close();
      this.anchorEl?.focus();
    }
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

  /** Moves focus into the menu once it is on screen, as the pattern requires. */
  private focusFirstItem(): void {
    this.focusableItems()[0]?.focus();
  }

  @HostListener('document:keydown.escape')
  onDocumentEscape(): void {
    if (!this.isOpen()) {
      return;
    }
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (!target) {
      return;
    }
    const panelEl = this.panelRef()?.nativeElement;
    const inPanel = panelEl?.contains(target) ?? false;
    const inAnchor = this.anchorEl?.contains(target) ?? false;
    if (!inPanel && !inAnchor) {
      this.close();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.isOpen()) {
      this.updatePanelPosition();
    }
  }

  /** Ancestor that becomes the containing block for `position: fixed` (e.g. Storybook Docs wrappers with `transform`). */
  private createsFixedContainingBlock(el: HTMLElement): boolean {
    const s = getComputedStyle(el);
    if (s.transform && s.transform !== 'none') {
      return true;
    }
    if (s.perspective && s.perspective !== 'none') {
      return true;
    }
    if (s.filter && s.filter !== 'none') {
      return true;
    }
    const contain = s.contain;
    if (contain && contain !== 'none' && contain.split(/\s+/).includes('paint')) {
      return true;
    }
    return false;
  }

  private getFixedPositioningContainingBlock(from: HTMLElement): HTMLElement {
    for (let p = from.parentElement; p; p = p.parentElement) {
      if (this.createsFixedContainingBlock(p)) {
        return p;
      }
    }
    return this.document.documentElement;
  }
}
