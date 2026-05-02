import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AtcSize } from '../../models';

@Component({
  selector: 'atc-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class AtcModal {
  /** Modal title */
  title = input<string>('');
  /** Size variant */
  size = input<AtcSize>('md');
  /** Whether to show close button in header */
  showCloseButton = input<boolean>(true);
  /** Whether clicking backdrop closes the modal */
  closeOnBackdrop = input<boolean>(true);
  /** Whether pressing Escape closes the modal */
  closeOnEscape = input<boolean>(true);

  /** Open/close state */
  isOpen = signal(false);
  /** Visibility for animation */
  isVisible = signal(false);

  /** Emitted when the modal is closed */
  closed = output<void>();

  /** Reference to the modal panel for focus management */
  private modalPanel = viewChild<ElementRef>('modalPanel');

  panelClasses = computed(() => {
    const base = [
      'relative bg-white rounded-xl shadow-2xl',
      'w-full transform transition-all duration-200',
    ];

    const sizeMap: Record<AtcSize, string> = {
      xs: 'max-w-sm',
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };

    const animation = this.isVisible()
      ? 'opacity-100 scale-100'
      : 'opacity-0 scale-95';

    return [...base, sizeMap[this.size()], animation].join(' ');
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        // Small delay to trigger entrance animation
        requestAnimationFrame(() => {
          this.isVisible.set(true);
          this.modalPanel()?.nativeElement?.focus();
        });
      }
    });
  }

  /** Open the modal */
  open(): void {
    this.isOpen.set(true);
  }

  /** Close the modal */
  close(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this.isOpen.set(false);
      this.closed.emit();
    }, 200);
  }
}
