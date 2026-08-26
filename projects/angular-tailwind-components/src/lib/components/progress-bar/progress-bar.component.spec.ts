import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindProgressBar } from './progress-bar.component';

describe('TailwindProgressBar', () => {
  let fixture: ComponentFixture<TailwindProgressBar>;
  let component: TailwindProgressBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindProgressBar]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindProgressBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function track(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="progressbar"]');
  }

  function bar(): HTMLElement {
    return track().firstElementChild as HTMLElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the progressbar range', () => {
    expect(track().getAttribute('aria-valuemin')).toBe('0');
    expect(track().getAttribute('aria-valuemax')).toBe('100');
    expect(track().getAttribute('aria-valuenow')).toBe('0');
  });

  it('should report the current value', () => {
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();

    expect(track().getAttribute('aria-valuenow')).toBe('42');
    expect(bar().style.width).toBe('42%');
  });

  it('should clamp values outside the range', () => {
    fixture.componentRef.setInput('value', 140);
    fixture.detectChanges();
    expect(component.clampedValue()).toBe(100);

    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();
    expect(component.clampedValue()).toBe(0);
  });

  it('should fall back to a generic accessible name', () => {
    expect(track().getAttribute('aria-label')).toBe('Progress');

    fixture.componentRef.setInput('label', 'Upload');
    fixture.detectChanges();
    expect(track().getAttribute('aria-label')).toBe('Upload');
  });

  it('should render the label row only when asked', () => {
    fixture.componentRef.setInput('label', 'Upload');
    fixture.componentRef.setInput('showLabel', true);
    fixture.componentRef.setInput('value', 30);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Upload');
    expect(fixture.nativeElement.textContent).toContain('30%');

    fixture.componentRef.setInput('showLabel', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('30%');
  });

  it('should fill the whole track while indeterminate', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('value', 10);
    fixture.detectChanges();

    expect(bar().style.width).toBe('100%');
  });

  it('should not print a percentage while indeterminate', () => {
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('showValue', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('10%');

    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('%');
  });

  it('should drop aria-valuenow while indeterminate so the progress is announced as unknown', () => {
    fixture.componentRef.setInput('value', 10);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();

    expect(track().hasAttribute('aria-valuenow')).toBe(false);
    expect(track().getAttribute('aria-valuemax')).toBe('100');
  });

  it('should skip the label row entirely when it would be empty', () => {
    fixture.componentRef.setInput('indeterminate', true);
    fixture.componentRef.setInput('showLabel', true);
    fixture.componentRef.setInput('label', '');
    fixture.detectChanges();

    // Only the track is left: no stray row keeping its bottom margin.
    expect(fixture.nativeElement.querySelector('.mb-1\\.5')).toBeNull();
  });
});
