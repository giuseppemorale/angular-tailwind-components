import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { AtcPosition } from '../../models';

@Component({
  selector: 'atc-tooltip',
  standalone: true,
  template: `
    <div
      class="relative inline-flex"
      (mouseenter)="show()"
      (mouseleave)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
    >
      <ng-content />

      @if (isVisible()) {
        <div
          role="tooltip"
          [class]="tooltipClasses()"
        >
          {{ text() }}
          <!-- Arrow -->
          <div [class]="arrowClasses()"></div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
    }
  `,
})
export class AtcTooltip {
  /** Tooltip text */
  text = input.required<string>();
  /** Position relative to trigger */
  position = input<AtcPosition>('top');
  /** Delay before showing (ms) */
  showDelay = input<number>(200);
  /** Delay before hiding (ms) */
  hideDelay = input<number>(100);

  isVisible = signal(false);
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  tooltipClasses = computed(() => {
    const base = [
      'absolute z-[1070] px-3 py-1.5',
      'text-xs font-medium text-white bg-surface-900 rounded-lg',
      'shadow-lg whitespace-nowrap pointer-events-none',
      'transition-opacity duration-150',
      this.isVisible() ? 'opacity-100' : 'opacity-0',
    ];

    const posMap: Record<AtcPosition, string> = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return [...base, posMap[this.position()]].join(' ');
  });

  arrowClasses = computed(() => {
    const base = 'absolute w-2 h-2 bg-surface-900 rotate-45';

    const posMap: Record<AtcPosition, string> = {
      top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
      left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
      right: 'right-full top-1/2 -translate-y-1/2 -mr-1',
    };

    return `${base} ${posMap[this.position()]}`;
  });

  show(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
    this.showTimeout = setTimeout(() => {
      this.isVisible.set(true);
    }, this.showDelay());
  }

  hide(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.hideTimeout = setTimeout(() => {
      this.isVisible.set(false);
    }, this.hideDelay());
  }
}
