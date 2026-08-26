import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindPopconfirm } from './popconfirm.component';

@Component({
  imports: [TailwindPopconfirm],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button type="button" #trigger (click)="confirm().toggle(trigger)">Delete</button>
    <tailwind-popconfirm message="Delete this row?" />
  `
})
class PopconfirmHostComponent {
  readonly confirm = viewChild.required(TailwindPopconfirm);
}

describe('TailwindPopconfirm', () => {
  let fixture: ComponentFixture<PopconfirmHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopconfirmHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopconfirmHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function panel(): HTMLElement | null {
    return document.querySelector('.cdk-overlay-container [role="alertdialog"]');
  }

  function panelButtons(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll('.cdk-overlay-container button'));
  }

  it('should render nothing until opened', () => {
    expect(panel()).toBeNull();
  });

  it('should open as an alertdialog described by its question', () => {
    trigger().click();
    fixture.detectChanges();

    const described = panel()?.getAttribute('aria-describedby');
    expect(described).toBeTruthy();
    expect(document.getElementById(described!)?.textContent).toContain('Delete this row?');
  });

  it('should emit confirmed and close on the confirm button', () => {
    const spy = vi.fn();
    fixture.componentInstance.confirm().confirmed.subscribe(spy);

    trigger().click();
    fixture.detectChanges();
    // Cancel comes first in the DOM, so confirm is the second button.
    panelButtons()[1].click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(panel()).toBeNull();
  });

  it('should emit cancelled and close on the cancel button', () => {
    const spy = vi.fn();
    fixture.componentInstance.confirm().cancelled.subscribe(spy);

    trigger().click();
    fixture.detectChanges();
    panelButtons()[0].click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(panel()).toBeNull();
  });

  it('should treat Escape as a cancellation', () => {
    const confirmed = vi.fn();
    const cancelled = vi.fn();
    fixture.componentInstance.confirm().confirmed.subscribe(confirmed);
    fixture.componentInstance.confirm().cancelled.subscribe(cancelled);

    trigger().click();
    fixture.detectChanges();
    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(cancelled).toHaveBeenCalledTimes(1);
    expect(confirmed).not.toHaveBeenCalled();
  });

  it('should default the confirm button to the danger colour', () => {
    trigger().click();
    fixture.detectChanges();

    expect(panelButtons()[1].className).toContain('bg-danger-600');
  });
});
