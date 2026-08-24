import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindAccordion } from './accordion.component';
import { TailwindAccordionItem } from './accordion-item.component';

@Component({
  imports: [TailwindAccordion, TailwindAccordionItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-accordion id="faq">
      <tailwind-accordion-item title="First">Content one</tailwind-accordion-item>
      <tailwind-accordion-item title="Second" [disabled]="secondDisabled">Content two</tailwind-accordion-item>
    </tailwind-accordion>
  `
})
class AccordionHostComponent {
  secondDisabled = false;
}

describe('TailwindAccordion', () => {
  let fixture: ComponentFixture<AccordionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionHostComponent);
    fixture.detectChanges();
  });

  function triggers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('tailwind-accordion')).toBeTruthy();
  });

  it('should render one collapsed trigger per item', () => {
    expect(triggers().length).toBe(2);
    expect(triggers().map(t => t.getAttribute('aria-expanded'))).toEqual(['false', 'false']);
    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeNull();
  });

  it('should not emit a duplicate id on host and wrapper', () => {
    const withId: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('#faq'));
    expect(withId.length).toBe(1);
    expect(withId[0].tagName.toLowerCase()).toBe('tailwind-accordion');
  });

  it('should expand on click and link the trigger to its panel', () => {
    triggers()[0].click();
    fixture.detectChanges();

    const trigger = triggers()[0];
    const panel: HTMLElement = fixture.nativeElement.querySelector('[role="region"]');

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(panel.textContent).toContain('Content one');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
  });

  it('should give each item its own generated ids', () => {
    triggers()[0].click();
    triggers()[1].click();
    fixture.detectChanges();

    const panels: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('[role="region"]'));
    expect(panels.length).toBe(2);
    expect(panels[0].id).not.toBe(panels[1].id);
  });

  it('should collapse again on a second click', () => {
    triggers()[0].click();
    fixture.detectChanges();
    triggers()[0].click();
    fixture.detectChanges();

    expect(triggers()[0].getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeNull();
  });

  it('should disable the trigger of a disabled item', () => {
    // Set before the first check: flipping it afterwards is an ExpressionChanged error in the host.
    const disabledFixture = TestBed.createComponent(AccordionHostComponent);
    disabledFixture.componentInstance.secondDisabled = true;
    disabledFixture.detectChanges();

    const second: HTMLButtonElement = disabledFixture.nativeElement.querySelectorAll('button')[1];
    expect(second.disabled).toBe(true);

    second.click();
    disabledFixture.detectChanges();
    expect(second.getAttribute('aria-expanded')).toBe('false');
    disabledFixture.destroy();
  });
});
