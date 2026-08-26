import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindStep } from './step.component';
import { TailwindStepper } from './stepper.component';

@Component({
  imports: [TailwindStepper, TailwindStep],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-stepper [(activeIndex)]="activeIndex" [linear]="linear">
      <tailwind-step label="Account" description="Your details">Step one body</tailwind-step>
      <tailwind-step label="Address">Step two body</tailwind-step>
      <tailwind-step label="Review" [optional]="true">Step three body</tailwind-step>
    </tailwind-stepper>
  `
})
class StepperHostComponent {
  activeIndex = 0;
  linear = false;
}

describe('TailwindStepper', () => {
  let fixture: ComponentFixture<StepperHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StepperHostComponent);
    fixture.detectChanges();
  });

  function indicators(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.tailwind-stepper button'));
  }

  it('should render one indicator per step', () => {
    expect(indicators().length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Account');
    expect(fixture.nativeElement.textContent).toContain('Your details');
  });

  it('should mark the active step with aria-current', () => {
    expect(indicators()[0].getAttribute('aria-current')).toBe('step');
    expect(indicators()[1].getAttribute('aria-current')).toBeNull();
  });

  it('should move to a step when its indicator is activated', () => {
    indicators()[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeIndex).toBe(1);
    expect(indicators()[1].getAttribute('aria-current')).toBe('step');
  });

  it('should show only the active step body', () => {
    expect(fixture.nativeElement.textContent).toContain('Step one body');
    expect(fixture.nativeElement.textContent).not.toContain('Step two body');

    indicators()[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Step two body');
  });

  it('should number the steps', () => {
    expect(indicators().map(b => b.textContent?.trim().charAt(0))).toEqual(['1', '2', '3']);
  });

  it('should swap the number for a tick on steps completed via next()', () => {
    const stepper = fixture.debugElement.children[0].componentInstance as TailwindStepper;

    expect(fixture.nativeElement.querySelectorAll('tailwind-icon').length).toBe(0);

    stepper.next();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeIndex).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tailwind-icon').length).toBe(1);
  });

  it('should only allow going back in linear mode', () => {
    const linear = TestBed.createComponent(StepperHostComponent);
    linear.componentInstance.linear = true;
    linear.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(linear.nativeElement.querySelectorAll('.tailwind-stepper button'));
    buttons[2].click();
    linear.detectChanges();
    // Jumping ahead is blocked while the flow is linear.
    expect(linear.componentInstance.activeIndex).toBe(0);
    linear.destroy();
  });
});
