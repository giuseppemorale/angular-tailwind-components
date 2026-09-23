import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindNumberInput } from './number-input.component';

describe('TailwindNumberInput', () => {
  let fixture: ComponentFixture<TailwindNumberInput>;
  let component: TailwindNumberInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindNumberInput]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindNumberInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function field(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function steppers(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('button'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Without it the input keeps its intrinsic width and pushes the +/- buttons out of a narrow field.
  it('should let the input shrink inside the flex row', () => {
    expect(field().classList).toContain('min-w-0');
  });

  it('should start empty rather than at zero', () => {
    expect(component.value()).toBeNull();
  });

  it('should step up and down with the buttons', () => {
    steppers()[1].click();
    fixture.detectChanges();
    expect(component.value()).toBe(1);

    steppers()[0].click();
    fixture.detectChanges();
    expect(component.value()).toBe(0);
  });

  it('should honour a custom step', () => {
    fixture.componentRef.setInput('step', 0.25);
    steppers()[1].click();
    fixture.detectChanges();
    steppers()[1].click();
    fixture.detectChanges();

    // Rounded, so repeated stepping cannot drift into 0.5000000000000001.
    expect(component.value()).toBe(0.5);
  });

  it('should clamp to min and max', () => {
    fixture.componentRef.setInput('min', 1);
    fixture.componentRef.setInput('max', 3);
    fixture.detectChanges();

    component.increment();
    component.increment();
    component.increment();
    component.increment();
    fixture.detectChanges();
    expect(component.value()).toBe(3);

    component.decrement();
    component.decrement();
    component.decrement();
    component.decrement();
    fixture.detectChanges();
    expect(component.value()).toBe(1);
  });

  it('should disable the steppers at the bounds', () => {
    fixture.componentRef.setInput('min', 0);
    fixture.componentRef.setInput('max', 1);
    component.writeValue(0);
    fixture.detectChanges();

    expect(steppers()[0].disabled).toBe(true);
    expect(steppers()[1].disabled).toBe(false);
  });

  it('should step with the arrow keys', () => {
    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(component.value()).toBe(1);

    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(component.value()).toBe(0);
  });

  it('should treat an emptied field as null, not zero', () => {
    component.writeValue(5);
    fixture.detectChanges();

    const input = field();
    input.value = '';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBeNull();
  });

  it('should associate label and control', () => {
    fixture.componentRef.setInput('label', 'Quantity');
    fixture.detectChanges();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    expect(label.getAttribute('for')).toBe(field().id);
  });

  it('should name the steppers for assistive technology', () => {
    expect(steppers()[0].getAttribute('aria-label')).toBe('Decrease');
    expect(steppers()[1].getAttribute('aria-label')).toBe('Increase');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue(7);
    expect(component.value()).toBe(7);

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
    expect(field().disabled).toBe(true);
  });
});
