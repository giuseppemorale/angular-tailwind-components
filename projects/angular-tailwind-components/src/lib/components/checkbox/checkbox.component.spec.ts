import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindCheckbox } from './checkbox.component';

describe('TailwindCheckbox', () => {
  let fixture: ComponentFixture<TailwindCheckbox>;
  let component: TailwindCheckbox;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindCheckbox],
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

    const label = fixture.nativeElement.querySelector('.text-surface-800');
    expect(label?.textContent).toContain('Accept terms');
  });
});
