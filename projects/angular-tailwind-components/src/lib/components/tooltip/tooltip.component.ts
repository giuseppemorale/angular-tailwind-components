import {
  Component,
  computed,
  inject,
  input,
  signal,
  OnDestroy,
  AfterViewInit,
  NgZone,
  ElementRef,
  viewChild
} from '@angular/core';
import { TailwindPosition } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'tailwind-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.css'
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

  readonly tooltipShellClasses = computed(() => {
    const base = [
      'fixed z-[1070] pointer-events-none transition-opacity duration-150',
      this.isVisible() ? 'opacity-100' : 'opacity-0'
    ];
    return this.mergeClasses(...base);
  });

  readonly tooltipBodyClasses = computed(
    () =>
      'relative z-[1] text-xs font-medium text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap px-3 py-1.5'
  );

  readonly arrowSpec = computed(() => {
    const specs: Record<
      TailwindPosition,
      { className: string; viewBox: string; width: number; height: number; path: string }
    > = {
      top: {
        className: 'tooltip-arrow tooltip-arrow-down',
        viewBox: '0 0 12 7',
        width: 12,
        height: 7,
        path: 'M0 0 H12 L6 7 Z'
      },
      bottom: {
        className: 'tooltip-arrow tooltip-arrow-up',
        viewBox: '0 0 12 7',
        width: 12,
        height: 7,
        path: 'M0 7 H12 L6 0 Z'
      },
      left: {
        className: 'tooltip-arrow tooltip-arrow-right',
        viewBox: '0 0 7 12',
        width: 7,
        height: 12,
        path: 'M0 0 V12 L7 6 Z'
      },
      right: {
        className: 'tooltip-arrow tooltip-arrow-left',
        viewBox: '0 0 7 12',
        width: 7,
        height: 12,
        path: 'M7 0 V12 L0 6 Z'
      }
    };

    return specs[this.position()];
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
      this.topPos.set(Math.round(top - origin.top));
      this.leftPos.set(Math.round(left - origin.left));
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
