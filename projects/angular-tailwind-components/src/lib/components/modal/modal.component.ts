import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TailwindSize } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindButton } from '../button/button.component';
import { lockBodyScroll, releaseBodyScroll } from '../../util/body-scroll-lock';
import { TailwindComponent } from '../tailwind.component';

/** Exit animation duration, kept in sync with the panel transition in the template. */
const EXIT_ANIMATION_MS = 200;

@Component({
  imports: [TailwindButton, CdkTrapFocus],
  selector: 'tailwind-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindModal extends TailwindComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly labels = inject(TAILWIND_LABELS);

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
  readonly onClose = output<void>();

  private readonly modalPanel = viewChild<ElementRef<HTMLElement>>('modalPanel');
  private exitTimeout: ReturnType<typeof setTimeout> | undefined;
  /** Element focused before opening, refocused on close so keyboard users keep their place. */
  private previouslyFocused: HTMLElement | null = null;

  readonly resolvedCloseLabel = computed(() => this.closeLabel() || this.labels.close);

  readonly panelClasses = computed(() => {
    const base = ['relative bg-surface rounded-xl shadow-2xl', 'w-full transform transition-all duration-200'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'max-w-sm',
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    const animation = this.isVisible() ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

    return this.mergeClasses(...base, sizeMap[this.size()], animation);
  });

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.freeScrollLock());
    effect(() => {
      if (this.isOpen()) {
        requestAnimationFrame(() => {
          this.isVisible.set(true);
          this.modalPanel()?.nativeElement?.focus();
        });
      }
    });
  }

  /** Open the modal */
  open(): void {
    if (this.isOpen()) return;
    const active = this.document.activeElement;
    this.previouslyFocused = active instanceof HTMLElement ? active : null;
    this.acquireScrollLock();
    this.isOpen.set(true);
  }

  /** Close the modal (plays exit animation then emits onClose) */
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
