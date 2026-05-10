import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTextarea } from './textarea.component';

describe('TailwindTextarea', () => {
  let fixture: ComponentFixture<TailwindTextarea>;
  let component: TailwindTextarea;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindTextarea]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTextarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Description');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label?.textContent).toContain('Description');
  });

  it('should show error text when hasError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'This field is required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-danger-600');
    expect(error?.textContent).toContain('This field is required');
  });

  it('should update value on input', () => {
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.value = 'multi\nline';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('multi\nline');
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
