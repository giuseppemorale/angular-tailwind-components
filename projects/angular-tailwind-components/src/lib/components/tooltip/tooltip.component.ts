import { Component, computed, inject, input, signal, OnDestroy, AfterViewInit, NgZone, ElementRef, viewChild } from '@angular/core';
import { TailwindPosition } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'tailwind-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TailwindTooltip extends TailwindComponent implements AfterViewInit, OnDestroy {
  /** Tooltip text */
  readonly text = input.required<string>();
  /** Position relative to trigger */
  readonly position = input<TailwindPosition>('top');

  readonly isVisible = signal(false);
  readonly topPos = signal<number>(0);
  readonly leftPos = signal<number>(0);

  private targetElement: HTMLElement | null = null;

  private document = inject(DOCUMENT);
  private ngZone = inject(NgZone);
  private el = inject(ElementRef);
  
  readonly tooltipEl = viewChild.required<ElementRef<HTMLDivElement>>('tooltipEl');

  private scrollListener = () => this.updatePosition();

  readonly tooltipClasses = computed(() => {
    const base = [
      'fixed z-[1070] px-3 py-1.5',
      'text-xs font-medium text-white bg-surface-900 rounded-lg',
      'shadow-lg whitespace-nowrap pointer-events-none',
      'transition-opacity duration-150',
      this.isVisible() ? 'opacity-100' : 'opacity-0'
    ];
    return base.join(' ');
  });

  readonly arrowClasses = computed(() => {
    const base = 'absolute w-2 h-2 bg-surface-900 rotate-45';

    const posMap: Record<TailwindPosition, string> = {
      top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
      left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
      right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
    };

    return `${base} ${posMap[this.position()]}`;
  });

  ngAfterViewInit() {
    this.updatePosition();
  }

  ngOnDestroy() {
    this.hide();
  }

  setTarget(el: HTMLElement) {
    this.targetElement = el;
    this.updatePosition();
  }

  private getFixedOrigin(): { top: number; left: number } {
    const dummy = this.document.createElement('div');
    dummy.style.position = 'fixed';
    dummy.style.top = '0';
    dummy.style.left = '0';
    this.el.nativeElement.appendChild(dummy);
    const rect = dummy.getBoundingClientRect();
    this.el.nativeElement.removeChild(dummy);
    return { top: rect.top, left: rect.left };
  }

  updatePosition(): void {
    if (!this.targetElement) return;
    
    const origin = this.getFixedOrigin();
    const targetRect = this.targetElement.getBoundingClientRect();
    const tooltipRect = this.tooltipEl().nativeElement.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.position()) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 8;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 8;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + 8;
        break;
    }

    this.ngZone.run(() => {
      this.topPos.set(top - origin.top);
      this.leftPos.set(left - origin.left);
    });
  }

  show(): void {
    this.updatePosition();
    this.ngZone.run(() => {
      this.isVisible.set(true);
    });
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollListener, true);
      window.addEventListener('resize', this.scrollListener, true);
    });
  }

  hide(): void {
    this.ngZone.run(() => {
      this.isVisible.set(false);
    });
    window.removeEventListener('scroll', this.scrollListener, true);
    window.removeEventListener('resize', this.scrollListener, true);
  }
}
