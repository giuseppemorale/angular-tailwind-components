import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewContainerRef,
  inject,
  input
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TailwindTooltip } from '../../components/tooltip/tooltip.component';
import { TailwindPosition } from '../../models';

@Directive({
  // `[tooltip]` is the original, unprefixed selector and stays supported; `[tailwindTooltip]` is the
  // prefixed one new code should use, so the directive cannot collide with another library's.
  selector: '[tooltip], [tailwindTooltip]',
  standalone: true
})
export class TailwindTooltipDirective implements OnDestroy {
  /** Tooltip text */
  readonly tooltip = input.required<string>();
  /** Position relative to the trigger */
  readonly tooltipPosition = input<TailwindPosition>('top');

  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private componentRef: ComponentRef<TailwindTooltip> | null = null;

  private viewContainerRef = inject(ViewContainerRef);
  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  private get host(): HTMLElement {
    return this.el.nativeElement;
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  show(): void {
    if (!this.tooltip()?.trim()) {
      return;
    }

    this.clearHideTimeout();

    if (this.componentRef) {
      this.updateTooltipComponent();
      this.componentRef.instance.show();
      return;
    }

    if (this.showTimeout) {
      return;
    }

    this.showTimeout = setTimeout(() => {
      this.showTimeout = null;
      this.createComponent();
    }, 200);
  }

  @HostListener('mouseleave')
  hideFromPointer(): void {
    this.hide();
  }

  /** WCAG 1.4.13: content shown on hover or focus must be dismissible without moving the pointer. */
  @HostListener('document:keydown.escape')
  hideFromEscape(): void {
    if (this.componentRef) {
      this.hide();
    }
  }

  @HostListener('focusout', ['$event'])
  hideFromFocus(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (related && this.host.contains(related)) {
      return;
    }

    queueMicrotask(() => {
      if (!this.host.contains(document.activeElement)) {
        this.hide();
      }
    });
  }

  private hide(): void {
    this.clearShowTimeout();

    if (!this.componentRef) {
      return;
    }

    this.componentRef.instance.hide();

    this.hideTimeout = setTimeout(() => {
      this.hideTimeout = null;
      this.destroyComponent();
    }, 150);
  }

  private clearShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  private clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private createComponent(): void {
    if (this.componentRef) {
      this.destroyComponent();
    }

    this.componentRef = this.viewContainerRef.createComponent(TailwindTooltip);
    const tooltipHost = this.componentRef.location.nativeElement as HTMLElement;
    if (tooltipHost.parentNode !== this.document.body) {
      this.document.body.appendChild(tooltipHost);
    }
    this.updateTooltipComponent();
    // Without this the tooltip text is invisible to assistive technology.
    this.host.setAttribute('aria-describedby', this.componentRef.instance.elementId());

    setTimeout(() => {
      if (this.componentRef) {
        this.componentRef.instance.show();
      }
    });
  }

  private updateTooltipComponent(): void {
    if (!this.componentRef) {
      return;
    }

    this.componentRef.setInput('text', this.tooltip());
    this.componentRef.setInput('position', this.tooltipPosition());
    this.componentRef.instance.setTarget(this.host);
    this.componentRef.changeDetectorRef.detectChanges();
  }

  private destroyComponent(): void {
    if (this.componentRef) {
      this.host.removeAttribute('aria-describedby');
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
    this.destroyComponent();
  }
}
