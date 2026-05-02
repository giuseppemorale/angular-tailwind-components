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
  standalone: true,
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1040] transition-opacity duration-200"
        [class.opacity-100]="isVisible()"
        [class.opacity-0]="!isVisible()"
        (click)="closeOnBackdrop() && close()"
        aria-hidden="true"
      ></div>

      <!-- Modal -->
      <div
        class="fixed inset-0 z-[1050] overflow-y-auto"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-label]="title()"
        (keydown.escape)="closeOnEscape() && close()"
      >
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            #modalPanel
            [class]="panelClasses()"
            tabindex="-1"
          >
            <!-- Header -->
            @if (title() || showCloseButton()) {
              <div class="flex items-center justify-between px-6 py-4 border-b border-surface-200">
                @if (title()) {
                  <h2 class="text-lg font-semibold text-surface-900">{{ title() }}</h2>
                }
                @if (showCloseButton()) {
                  <button
                    type="button"
                    class="p-1.5 -m-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors cursor-pointer"
                    aria-label="Close"
                    (click)="close()"
                  >
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                }
              </div>
            }

            <!-- Body -->
            <div class="px-6 py-5">
              <ng-content />
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-surface-100 bg-surface-50/50 rounded-b-xl">
              <ng-content select="[atcModalFooter]" />
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
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
