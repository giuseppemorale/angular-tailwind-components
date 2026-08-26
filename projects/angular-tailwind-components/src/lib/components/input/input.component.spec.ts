import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TailwindInput } from './input.component';

@Component({
  imports: [TailwindInput, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<tailwind-input label="Email" errorText="Required" [formControl]="control" />`
})
class ReactiveHostComponent {
  readonly control = new FormControl('', Validators.required);
}

describe('TailwindInput', () => {
  let fixture: ComponentFixture<TailwindInput>;
  let component: TailwindInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindInput]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label?.textContent).toContain('Test Label');
  });

  it('should show error text when hasError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'This field is required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-danger-600');
    expect(error?.textContent).toContain('This field is required');
  });

  it('should render HTML in error text', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'Read the <a href="/terms">terms</a>');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.text-danger-600 a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/terms');
    expect(link?.textContent).toContain('terms');
  });

  it('should update value on input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'test value';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('test value');
  });

  it('should implement CVA writeValue', () => {
    component.writeValue('hello');
    expect(component.value()).toBe('hello');
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should mark the field required in the DOM and with an asterisk', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('required')).not.toBeNull();
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain('*');
  });

  it('should forward native attributes the consumer could not reach before', () => {
    fixture.componentRef.setInput('autocomplete', 'email');
    fixture.componentRef.setInput('name', 'email');
    fixture.componentRef.setInput('inputmode', 'email');
    fixture.componentRef.setInput('maxlength', 40);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('autocomplete')).toBe('email');
    expect(input.getAttribute('name')).toBe('email');
    expect(input.getAttribute('inputmode')).toBe('email');
    expect(input.getAttribute('maxlength')).toBe('40');
  });

  it('should render prefix and suffix icons with padding for them', () => {
    fixture.componentRef.setInput('prefixIcon', 'magnifying-glass');
    fixture.componentRef.setInput('suffixIcon', 'calendar');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tailwind-icon').length).toBe(2);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.className).toContain('pl-9');
    expect(input.className).toContain('pr-9');
  });

  it('should clear the value through the clear button', () => {
    fixture.componentRef.setInput('clearable', true);
    component.writeValue('something');
    fixture.detectChanges();

    const clear: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(clear).toBeTruthy();
    clear.click();
    fixture.detectChanges();

    expect(component.value()).toBe('');
  });

  it('should not offer the clear button while empty', () => {
    fixture.componentRef.setInput('clearable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('should show a character counter against maxlength', () => {
    fixture.componentRef.setInput('maxlength', 10);
    fixture.componentRef.setInput('showCounter', true);
    component.writeValue('abc');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('3 / 10');
  });

  it('should describe the field with helper text and counter together', () => {
    fixture.componentRef.setInput('helperText', 'We never share it');
    fixture.componentRef.setInput('maxlength', 10);
    fixture.componentRef.setInput('showCounter', true);
    fixture.detectChanges();

    const describedBy = fixture.nativeElement.querySelector('input').getAttribute('aria-describedby');
    expect(describedBy?.split(' ').length).toBe(2);
  });

  describe('error state', () => {
    it('should stay valid while an invalid control is untouched', () => {
      const host = TestBed.createComponent(ReactiveHostComponent);
      host.detectChanges();

      const input: HTMLInputElement = host.nativeElement.querySelector('input');
      expect(host.componentInstance.control.invalid).toBe(true);
      // Nothing typed yet: showing an error here would be hostile.
      expect(input.getAttribute('aria-invalid')).toBeNull();
    });

    it('should derive the error state from the bound control once touched', () => {
      const host = TestBed.createComponent(ReactiveHostComponent);
      host.detectChanges();

      const input: HTMLInputElement = host.nativeElement.querySelector('input');
      host.componentInstance.control.markAsTouched();
      input.dispatchEvent(new Event('blur'));
      host.detectChanges();

      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(host.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Required');
      host.destroy();
    });

    it('should let an explicit hasError input win over the control state', () => {
      fixture.componentRef.setInput('hasError', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('input').getAttribute('aria-invalid')).toBe('true');
    });
  });
});
