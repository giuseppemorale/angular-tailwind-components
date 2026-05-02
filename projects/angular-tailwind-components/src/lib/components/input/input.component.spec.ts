import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindInput } from './input.component';

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

  it('should show required indicator', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const required = fixture.nativeElement.querySelector('.text-danger-500');
    expect(required?.textContent).toContain('*');
  });

  it('should show error text when hasError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'This field is required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-danger-600');
    expect(error?.textContent).toContain('This field is required');
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
});
