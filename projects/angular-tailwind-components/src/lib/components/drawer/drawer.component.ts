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
import { TailwindPosition } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';
import { EXIT_ANIMATION_MS, HIDDEN_TRANSFORM } from './properties/constant';

@Component({
  imports: [TailwindButton, CdkTrapFocus],
  selector: 'tailwind-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindDrawer extends TailwindComponent {
  private readonly document = inject(DOCUMENT);
  private readonly labels = inject(TAILWIND_LABELS);
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);

  /** Drawer title, rendered in the header and used as the dialog accessible name */
  readonly title = input<string>('');
  /** Accessible name for the dialog when `title` is omitted */
  readonly ariaLabel = input<string>('');
  /** Edge the panel slides in from */
  readonly position = input<TailwindPosition>('right');
  /** Size class along the sliding axis: width for `left`/`right`, height for `top`/`bottom` */
  readonly width = input<string>('');
  /** Whether clicking backdrop closes */
  readonly closeOnBackdrop = input<boolean>(true);
  /** Whether pressing Escape closes */
  readonly closeOnEscape = input<boolean>(true);
  /** Whether to show the close button in the header */
  readonly showCloseButton = input<boolean>(true);
  /** Accessible name of the close button; defaults to the app-wide `TAILWIND_LABELS.close`. */
  readonly closeLabel = input<string>('');

  /** Open/close state */
  readonly isOpen = signal(false);
  /** Visibility for animation */
  readonly isVisible = signal(false);

  /** Emitted when closed */
  readonly closed = output<void>();

  private readonly panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private readonly drawerPanel = viewChild<ElementRef<HTMLElement>>('drawerPanel');

  private overlayRef: OverlayRef | null = null;
  private overlaySub: Subscription | null = null;
  private exitTimeout: ReturnType<typeof setTimeout> | undefined;
  private previouslyFocused: HTMLElement | null = null;

  readonly resolvedCloseLabel = computed(() => this.closeLabel() || this.labels.close);

  /** `true` when the panel slides along the horizontal axis. */
  private readonly isHorizontal = computed(() => this.position() === 'left' || this.position() === 'right');

  /** Default extent differs per axis: a side sheet is narrow, a top/bottom sheet is short. */
  private readonly extentClass = computed(() => this.width() || (this.isHorizontal() ? 'max-w-md' : 'max-h-96'));

  readonly panelClasses = computed(() =>
    this.mergeClasses(
      'flex flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out',
      // Fill the perpendicular axis; `extentClass` caps the sliding one.
      this.isHorizontal() ? 'h-screen w-screen' : 'w-screen h-screen',
      this.extentClass(),
      this.isVisible() ? 'translate-x-0 translate-y-0' : HIDDEN_TRANSFORM[this.position()]
    )
  );

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.exitTimeout);
      this.disposeOverlay();
    });
  }

  open(): void {
    if (this.isOpen()) return;

    const active = this.document.activeElement;
    this.previouslyFocused = active instanceof HTMLElement ? active : null;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.edgePositionStrategy(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: ['tailwind-drawer-backdrop', 'cdk-overlay-dark-backdrop'],
      panelClass: 'tailwind-drawer-pane'
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
      this.drawerPanel()?.nativeElement?.focus();
    });
  }

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

  /**
   * Pins the pane to one edge. Only the sliding axis is set — the global strategy aligns rather
   * than stretches — and the panel covers the other axis itself with `h-screen` / `w-screen`.
   */
  private edgePositionStrategy() {
    const strategy = this.overlay.position().global();
    switch (this.position()) {
      case 'left':
        return strategy.left('0');
      case 'right':
        return strategy.right('0');
      case 'top':
        return strategy.top('0');
      case 'bottom':
        return strategy.bottom('0');
    }
  }

  private disposeOverlay(): void {
    this.overlaySub?.unsubscribe();
    this.overlaySub = null;
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
