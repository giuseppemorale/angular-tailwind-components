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

  it('should render tooltip text and position near the trigger', async () => {
    await showTooltip();
    const tooltip = getTooltip();
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain('Tooltip text');
    expect(tooltip?.style.top).not.toBe('0px');
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
