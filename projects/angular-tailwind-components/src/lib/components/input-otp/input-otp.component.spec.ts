import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindInputOtp } from './input-otp.component';

describe('TailwindInputOtp', () => {
  let fixture: ComponentFixture<TailwindInputOtp>;
  let component: TailwindInputOtp;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindInputOtp]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindInputOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one input per length', () => {
    fixture.componentRef.setInput('length', 4);
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(4);
  });

  it('should implement CVA writeValue', () => {
    component.writeValue('123');
    expect(component.value()).toBe('123');
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should update value when typing in first cell', () => {
    const inputs: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    inputs[0].value = '7';
    inputs[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.value()).toBe('7');
  });
});
