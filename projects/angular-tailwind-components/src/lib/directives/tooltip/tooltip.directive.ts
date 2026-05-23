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
import { TailwindTooltip } from '../../components/tooltip/tooltip.component';
import { TailwindPosition } from '../../models';

@Directive({
  selector: '[tooltip]',
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

  private get host(): HTMLElement {
    return this.el.nativeElement;
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  show(): void {
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
    this.updateTooltipComponent();

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
