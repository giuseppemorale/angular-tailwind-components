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
  viewChild
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TailwindPosition } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { lockBodyScroll, releaseBodyScroll } from '../../util/body-scroll-lock';
import { TailwindComponent } from '../tailwind.component';

/** Exit animation duration, kept in sync with the panel transition. */
const EXIT_ANIMATION_MS = 300;

@Component({
  imports: [TailwindButton, CdkTrapFocus],
  selector: 'tailwind-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindDrawer extends TailwindComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly labels = inject(TAILWIND_LABELS);

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
  readonly onClose = output<void>();

  private readonly drawerPanel = viewChild<ElementRef<HTMLElement>>('drawerPanel');
  private exitTimeout: ReturnType<typeof setTimeout> | undefined;
  private previouslyFocused: HTMLElement | null = null;

  readonly resolvedCloseLabel = computed(() => this.closeLabel() || this.labels.close);

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.freeScrollLock());
  }

  /** `true` when the panel slides along the horizontal axis. */
  private readonly isHorizontal = computed(() => this.position() === 'left' || this.position() === 'right');

  /** Default extent differs per axis: a side sheet is narrow, a top/bottom sheet is short. */
  private readonly extentClass = computed(() => this.width() || (this.isHorizontal() ? 'max-w-md' : 'max-h-96'));

  readonly panelClasses = computed(() => {
    const visible = this.isVisible();
    const base = [
      'fixed z-1050',
      'flex flex-col bg-surface shadow-2xl',
      'transition-transform duration-300 ease-in-out'
    ];

    const positionMap: Record<TailwindPosition, string[]> = {
      right: ['top-0 bottom-0 right-0 w-full', visible ? 'translate-x-0' : 'translate-x-full'],
      left: ['top-0 bottom-0 left-0 w-full', visible ? 'translate-x-0' : '-translate-x-full'],
      top: ['left-0 right-0 top-0 h-full', visible ? 'translate-y-0' : '-translate-y-full'],
      bottom: ['left-0 right-0 bottom-0 h-full', visible ? 'translate-y-0' : 'translate-y-full']
    };

    return this.mergeClasses(...base, ...positionMap[this.position()], this.extentClass());
  });

  open(): void {
    if (this.isOpen()) return;
    const active = this.document.activeElement;
    this.previouslyFocused = active instanceof HTMLElement ? active : null;
    this.acquireScrollLock();
    this.isOpen.set(true);
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
      this.isOpen.set(false);
      this.freeScrollLock();
      this.previouslyFocused?.focus();
      this.previouslyFocused = null;
      this.onClose.emit();
    }, EXIT_ANIMATION_MS);
  }
  /** Guards against double-locking and against leaking the lock if destroyed while open. */
  private scrollLocked = false;

  private acquireScrollLock(): void {
    if (this.scrollLocked) return;
    lockBodyScroll(this.document);
    this.scrollLocked = true;
  }

  private freeScrollLock(): void {
    if (!this.scrollLocked) return;
    releaseBodyScroll(this.document);
    this.scrollLocked = false;
  }
}
