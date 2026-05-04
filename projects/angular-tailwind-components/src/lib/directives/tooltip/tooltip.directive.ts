import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
  inject
} from '@angular/core';
import { TailwindTooltip } from '../../components/tooltip/tooltip.component';
import { TailwindPosition } from '../../models';

@Directive({
  selector: '[tooltip]'
})
export class TailwindTooltipDirective implements OnDestroy {
  @Input('tooltip') text!: string;
  @Input() tooltipPosition: TailwindPosition = 'top';

  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private componentRef: ComponentRef<TailwindTooltip> | null = null;

  private viewContainerRef = inject(ViewContainerRef);
  private el = inject(ElementRef);

  @HostListener('mouseenter')
  @HostListener('focusin')
  show() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    if (this.componentRef) {
      return;
    }

    this.showTimeout = setTimeout(() => {
      this.createComponent();
    }, 200);
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide() {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    if (!this.componentRef) {
      return;
    }

    this.componentRef.instance.hide();

    this.hideTimeout = setTimeout(() => {
      this.destroyComponent();
    }, 150);
  }

  private createComponent() {
    this.componentRef = this.viewContainerRef.createComponent(TailwindTooltip);
    this.componentRef.setInput('text', this.text);
    this.componentRef.setInput('position', this.tooltipPosition);
    this.componentRef.instance.setTarget(this.el.nativeElement);

    setTimeout(() => {
      if (this.componentRef) {
        this.componentRef.instance.show();
      }
    });
  }

  private destroyComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  ngOnDestroy() {
    if (this.showTimeout) clearTimeout(this.showTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.destroyComponent();
  }
}
