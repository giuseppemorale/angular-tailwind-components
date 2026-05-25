import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindCheckbox } from './checkbox.component';

describe('TailwindCheckbox', () => {
  let fixture: ComponentFixture<TailwindCheckbox>;
  let component: TailwindCheckbox;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindCheckbox]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindCheckbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle checked state', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
  });

  it('should implement CVA writeValue', () => {
    component.writeValue(true);
    expect(component.checked()).toBe(true);
  });

  it('should render label', () => {
    fixture.componentRef.setInput('label', 'Accept terms');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.text-neutral-800');
    expect(label?.textContent).toContain('Accept terms');
  });

  it('should apply palette accent CSS variables when color is set', () => {
    fixture.componentRef.setInput('color', 'emerald');
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();

    const box: HTMLElement = fixture.nativeElement.querySelector('label > div');
    expect(box.style.getPropertyValue('--tw-accent-bg')).toContain('--color-emerald-600');
  });
});
