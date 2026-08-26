import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindSlider } from './slider.component';

describe('TailwindSlider', () => {
  let fixture: ComponentFixture<TailwindSlider>;
  let component: TailwindSlider;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindSlider]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function thumbs(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="slider"]'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose one slider thumb with its range', () => {
    expect(thumbs().length).toBe(1);
    const thumb = thumbs()[0];
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('100');
    expect(thumb.getAttribute('aria-valuenow')).toBe('0');
  });

  it('should expose two thumbs in range mode', () => {
    fixture.componentRef.setInput('range', true);
    fixture.detectChanges();
    expect(thumbs().length).toBe(2);
  });

  it('should carry an accessible name on the thumb', () => {
    expect(thumbs()[0].getAttribute('aria-label')).toBeNull();

    fixture.componentRef.setInput('ariaLabel', 'Volume');
    fixture.detectChanges();
    expect(thumbs()[0].getAttribute('aria-label')).toBe('Volume');
  });

  it('should name each range thumb separately when asked', () => {
    fixture.componentRef.setInput('range', true);
    fixture.componentRef.setInput('minAriaLabel', 'Minimum price');
    fixture.componentRef.setInput('maxAriaLabel', 'Maximum price');
    fixture.detectChanges();

    expect(thumbs()[0].getAttribute('aria-label')).toBe('Minimum price');
    expect(thumbs()[1].getAttribute('aria-label')).toBe('Maximum price');
  });

  it('should fall back to the shared ariaLabel for both range thumbs', () => {
    fixture.componentRef.setInput('range', true);
    fixture.componentRef.setInput('ariaLabel', 'Price');
    fixture.detectChanges();

    expect(thumbs().map(t => t.getAttribute('aria-label'))).toEqual(['Price', 'Price']);
  });

  it('should snap values to the step', () => {
    fixture.componentRef.setInput('step', 25);
    fixture.detectChanges();

    expect(component.snap(30)).toBe(25);
    expect(component.snap(40)).toBe(50);
  });

  it('should clamp values to the bounds', () => {
    fixture.componentRef.setInput('min', 10);
    fixture.componentRef.setInput('max', 20);
    fixture.detectChanges();

    expect(component.snap(0)).toBe(10);
    expect(component.snap(99)).toBe(20);
  });

  it('should implement CVA writeValue for both modes', () => {
    component.writeValue(40);
    expect(component.singleValue()).toBe(40);

    fixture.componentRef.setInput('range', true);
    fixture.detectChanges();
    // A reversed pair is normalised rather than rejected.
    component.writeValue([70, 30]);
    expect(component.rangeLow()).toBe(30);
    expect(component.rangeHigh()).toBe(70);
  });

  it('should report disabled through the form and the input alike', () => {
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isEffectivelyDisabled()).toBe(true);

    component.setDisabledState(false);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.isEffectivelyDisabled()).toBe(true);
    expect(thumbs()[0].getAttribute('aria-disabled')).toBe('true');
  });
});
