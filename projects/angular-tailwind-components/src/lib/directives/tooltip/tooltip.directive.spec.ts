import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindInput } from '../../components/input/input.component';
import { TailwindTooltipDirective } from './tooltip.directive';

@Component({
  imports: [TailwindInput, TailwindTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-input label="Test" [tooltip]="tooltipText()" />
    <button type="button" data-outside>Outside</button>
  `
})
class TooltipHostComponent {
  readonly tooltipText = signal('Tooltip text');
}

// A component host that only forwards its children — the shape every `display: contents` component
// in the library has, and the one that used to leave the overlay measuring an empty rect.
@Component({
  imports: [TailwindTooltipDirective],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <span style="display: contents" tooltip="Passed through">
      <button type="button" data-control>Hover me</button>
    </span>
  `
})
class PassThroughHostComponent {}

describe('TailwindTooltipDirective', () => {
  let fixture: ComponentFixture<TooltipHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipHostComponent);
    fixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('tailwind-input input') as HTMLInputElement;
  }

  function getTooltip(): HTMLElement | null {
    return document.body.querySelector('[role="tooltip"]');
  }

  async function showTooltip(): Promise<void> {
    getInput().focus();
    await new Promise(resolve => setTimeout(resolve, 250));
    fixture.detectChanges();
  }

  it('should render tooltip text inside a positioned CDK overlay', async () => {
    await showTooltip();
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain('Tooltip text');

    // Placement now lives on the overlay pane, not on the tooltip element itself.
    const pane = tooltip?.closest('.cdk-overlay-pane') as HTMLElement | null;
    expect(pane).not.toBeNull();
    expect(pane?.classList.contains('tailwind-tooltip-pane')).toBe(true);
  });

  it('should point the arrow at the side the overlay resolved to', async () => {
    await showTooltip();
    // Default preference is `top`, so the arrow hangs below the bubble.
    expect(document.body.querySelector('.tooltip-arrow-down')).toBeTruthy();
  });

  it('should describe the trigger with the tooltip while it is shown', async () => {
    const trigger = fixture.nativeElement.querySelector('tailwind-input') as HTMLElement;
    expect(trigger.getAttribute('aria-describedby')).toBeNull();

    await showTooltip();

    const tooltip = getTooltip();
    expect(tooltip?.id).toBeTruthy();
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip?.id);
  });

  it('should stay pointer-reachable while visible (WCAG 1.4.13 hoverable)', async () => {
    await showTooltip();
    expect(getTooltip()?.className).not.toContain('pointer-events-none');
  });

  it('should hide tooltip when the nested input loses focus', async () => {
    await showTooltip();
    expect(getTooltip()).not.toBeNull();

    const outside = fixture.nativeElement.querySelector('[data-outside]') as HTMLButtonElement;
    outside.focus();
    await new Promise(resolve => setTimeout(resolve, 200));
    fixture.detectChanges();

    expect(getTooltip()).toBeNull();
  });

  it('should anchor to the control inside a pass-through host, not the host itself', async () => {
    const passThrough = TestBed.createComponent(PassThroughHostComponent);
    passThrough.detectChanges();

    const wrapper: HTMLElement = passThrough.nativeElement.querySelector('span');
    const control: HTMLElement = passThrough.nativeElement.querySelector('[data-control]');
    control.focus();
    await new Promise(resolve => setTimeout(resolve, 250));
    passThrough.detectChanges();

    // A host with no box reports a 0x0 rect at the document origin, which parks the overlay in the
    // top-left corner and puts the ARIA link on an element assistive technology never reaches.
    expect(control.getAttribute('aria-describedby')).toBe(getTooltip()?.id);
    expect(wrapper.getAttribute('aria-describedby')).toBeNull();

    passThrough.destroy();
  });

  it('should hide tooltip on focusout even when the pointer stays over the host', async () => {
    const host = fixture.nativeElement.querySelector('tailwind-input') as HTMLElement;
    host.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await showTooltip();
    expect(getTooltip()).not.toBeNull();

    const outside = fixture.nativeElement.querySelector('[data-outside]') as HTMLButtonElement;
    outside.focus();
    await new Promise(resolve => setTimeout(resolve, 200));
    fixture.detectChanges();

    expect(getTooltip()).toBeNull();
  });
});
