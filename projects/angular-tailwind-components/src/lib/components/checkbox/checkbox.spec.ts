import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtcCheckbox } from './checkbox';

describe('AtcCheckbox', () => {
  let fixture: ComponentFixture<AtcCheckbox>;
  let component: AtcCheckbox;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtcCheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(AtcCheckbox);
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
