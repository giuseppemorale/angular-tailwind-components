import { Component, computed, input, output, signal } from '@angular/core';
import { AtcPosition } from '../../models';

@Component({
  selector: 'atc-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
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
