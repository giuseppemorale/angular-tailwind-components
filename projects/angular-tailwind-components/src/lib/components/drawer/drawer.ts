import { Component, computed, input, output, signal } from '@angular/core';
import { AtcPosition } from '../../models';

@Component({
  selector: 'atc-drawer',
  standalone: true,
  template: `
    @if (isOpen()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1040] transition-opacity duration-300"
        [class.opacity-100]="isVisible()"
        [class.opacity-0]="!isVisible()"
        (click)="closeOnBackdrop() && close()"
        aria-hidden="true"
      ></div>

      <!-- Drawer Panel -->
      <div
        [class]="panelClasses()"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-label]="title()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          @if (title()) {
            <h2 class="text-lg font-semibold text-surface-900">{{ title() }}</h2>
          }
          <button
            type="button"
            class="p-1.5 -m-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors ml-auto cursor-pointer"
            aria-label="Close"
            (click)="close()"
          >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <ng-content />
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-surface-100 bg-surface-50/50">
          <ng-content select="[atcDrawerFooter]" />
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
export class AtcDrawer {
  /** Drawer title */
  title = input<string>('');
  /** Position (left or right) */
  position = input<'left' | 'right'>('right');
  /** Width class */
  width = input<string>('max-w-md');
  /** Whether clicking backdrop closes */
  closeOnBackdrop = input<boolean>(true);

  /** Open/close state */
  isOpen = signal(false);
  /** Visibility for animation */
  isVisible = signal(false);

  /** Emitted when closed */
  closed = output<void>();

  panelClasses = computed(() => {
    const base = [
      'fixed top-0 bottom-0 z-[1050]',
      'flex flex-col w-full bg-white shadow-2xl',
      'transition-transform duration-300 ease-in-out',
      this.width(),
    ];

    const pos = this.position();

    if (pos === 'right') {
      base.push('right-0');
      base.push(this.isVisible() ? 'translate-x-0' : 'translate-x-full');
    } else {
      base.push('left-0');
      base.push(this.isVisible() ? 'translate-x-0' : '-translate-x-full');
    }

    return base.join(' ');
  });

  open(): void {
    this.isOpen.set(true);
    requestAnimationFrame(() => {
      this.isVisible.set(true);
    });
  }

  close(): void {
    this.isVisible.set(false);
    setTimeout(() => {
      this.isOpen.set(false);
      this.closed.emit();
    }, 300);
  }
}
