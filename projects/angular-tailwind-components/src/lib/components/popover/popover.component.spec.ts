import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindPopover } from './popover.component';

@Component({
  imports: [TailwindPopover],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button type="button" #trigger (click)="popover().toggle(trigger)">Details</button>
    <tailwind-popover title="More" [showCloseButton]="true"><p>Panel body</p></tailwind-popover>
  `
})
class PopoverHostComponent {
  readonly popover = viewChild.required(TailwindPopover);
}

describe('TailwindPopover', () => {
  let fixture: ComponentFixture<PopoverHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopoverHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopoverHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function panel(): HTMLElement | null {
    return document.querySelector('.cdk-overlay-container [role="dialog"]');
  }

  it('should create', () => {
    expect(fixture.componentInstance.popover()).toBeTruthy();
  });

  it('should render nothing until opened', () => {
    expect(panel()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBeNull();
  });

  it('should open on trigger click and project its content', () => {
    trigger().click();
    fixture.detectChanges();

    expect(panel()?.textContent).toContain('Panel body');
  });

  it('should link the trigger to the panel while open', () => {
    trigger().click();
    fixture.detectChanges();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(trigger().getAttribute('aria-controls')).toBe(panel()?.id);
  });

  it('should name the panel from its title', () => {
    trigger().click();
    fixture.detectChanges();

    const labelledBy = panel()?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(document.querySelector('.cdk-overlay-container h3')?.id).toBe(labelledBy);
  });

  it('should toggle closed on a second trigger click', () => {
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(trigger().getAttribute('aria-controls')).toBeNull();
  });

  it('should close on Escape', () => {
    trigger().click();
    fixture.detectChanges();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('should close from its own close button', () => {
    trigger().click();
    fixture.detectChanges();

    document.querySelector<HTMLButtonElement>('.cdk-overlay-container button')?.click();
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('should report opening and closing', () => {
    const opened = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.popover().opened.subscribe(opened);
    fixture.componentInstance.popover().closed.subscribe(closed);

    trigger().click();
    fixture.detectChanges();
    expect(opened).toHaveBeenCalledTimes(1);

    trigger().click();
    fixture.detectChanges();
    expect(closed).toHaveBeenCalledTimes(1);
  });
});
