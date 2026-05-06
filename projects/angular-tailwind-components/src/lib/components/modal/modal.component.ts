import { Component, computed, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { TailwindSize } from '../../models';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class TailwindModal extends TailwindComponent {
  /** Size variant */
  readonly size = input<TailwindSize>('md');
  /** Whether to show close button in header */
  readonly showCloseButton = input<boolean>(true);
  /** Whether clicking backdrop closes the modal */
  readonly closeOnBackdrop = input<boolean>(true);
  /** Whether pressing Escape closes the modal */
  readonly closeOnEscape = input<boolean>(true);

  /** Open/close state */
  readonly isOpen = signal(false);
  /** Visibility for animation */
  readonly isVisible = signal(false);

  /** Emitted when the modal is fully closed (after exit animation) */
  readonly onClose = output<void>();

  private readonly modalPanel = viewChild<ElementRef>('modalPanel');

  readonly panelClasses = computed(() => {
    const base = ['relative bg-white rounded-xl shadow-2xl', 'w-full transform transition-all duration-200'];

    const sizeMap: Record<TailwindSize, string> = {
      xs: 'max-w-sm',
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    const animation = this.isVisible() ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

    return [...base, sizeMap[this.size()], animation].join(' ');
  });

  constructor() {
    super();
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
    this.isOpen.set(true);
  }

  /** Close the modal (plays exit animation then emits onClose) */
  close(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this.isOpen.set(false);
      this.onClose.emit();
    }, 200);
  }
}
