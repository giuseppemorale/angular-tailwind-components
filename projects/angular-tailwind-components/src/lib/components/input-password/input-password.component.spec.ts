import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TAILWIND_PASSWORD_LABELS } from '../../tokens';
import { TailwindInputPassword } from './input-password.component';
import { computePasswordStrength, passwordStrengthMeterFill } from '../../utils/password-strength.util';

describe('computePasswordStrength', () => {
  it('returns weak for empty password', () => {
    expect(computePasswordStrength('')).toEqual({ score: 0, level: 'weak' });
  });

  it('returns weak for short simple password', () => {
    const result = computePasswordStrength('abc');
    expect(result.level).toBe('weak');
  });

  it('returns medium for mixed password with reasonable length', () => {
    const result = computePasswordStrength('Abc12345');
    expect(result.level).toBe('medium');
  });

  it('returns strong for complex long password', () => {
    const result = computePasswordStrength('Zx9!mKp7@BnFdGh');
    expect(result.level).toBe('strong');
  });

  it('maps meter fill levels', () => {
    expect(passwordStrengthMeterFill('weak')).toBe(1);
    expect(passwordStrengthMeterFill('medium')).toBe(2);
    expect(passwordStrengthMeterFill('strong')).toBe(3);
  });
});

describe('TailwindInputPassword', () => {
  let fixture: ComponentFixture<TailwindInputPassword>;
  let component: TailwindInputPassword;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindInputPassword]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindInputPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    fixture.componentRef.setInput('label', 'Password');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    expect(label?.textContent).toContain('Password');
  });

  it('should show error text when hasError', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.componentRef.setInput('errorText', 'Password required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-red-600');
    expect(error?.textContent).toContain('Password required');
  });

  it('should update value on input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'secret';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('secret');
  });

  it('should implement CVA writeValue', () => {
    component.writeValue('hello');
    expect(component.value()).toBe('hello');
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should toggle input type when toggleMask is enabled', () => {
    fixture.componentRef.setInput('toggleMask', true);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('password');

    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });

  it('should show feedback panel on focus when feedback is enabled', () => {
    fixture.componentRef.setInput('feedback', true);
    component.writeValue('abc123');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="region"]')).toBeTruthy();
  });

  it('should use labels from TAILWIND_PASSWORD_LABELS token', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindInputPassword],
      providers: [
        {
          provide: TAILWIND_PASSWORD_LABELS,
          useValue: {
            prompt: 'Choose password',
            weak: 'Too weak',
            medium: 'Average',
            strong: 'Great'
          }
        }
      ]
    }).compileComponents();

    const tokenFixture = TestBed.createComponent(TailwindInputPassword);
    tokenFixture.componentRef.setInput('feedback', true);
    tokenFixture.componentInstance.writeValue('abc');
    tokenFixture.detectChanges();

    const input: HTMLInputElement = tokenFixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    tokenFixture.detectChanges();

    expect(tokenFixture.nativeElement.textContent).toContain('Choose password');
    expect(tokenFixture.nativeElement.textContent).toContain('Too weak');
  });
});
