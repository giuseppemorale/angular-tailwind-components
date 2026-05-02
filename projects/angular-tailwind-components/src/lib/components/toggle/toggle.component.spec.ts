import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindToggle } from './toggle.component';

describe('TailwindToggle', () => {
  let fixture: ComponentFixture<TailwindToggle>;
  let component: TailwindToggle;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindToggle]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindToggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle on click', () => {
    expect(component.checked()).toBe(false);
    component.toggle();
    expect(component.checked()).toBe(true);
    component.toggle();
    expect(component.checked()).toBe(false);
  });

  it('should not toggle when disabled', () => {
    component.setDisabledState(true);
    component.toggle();
    expect(component.checked()).toBe(false);
  });

  it('should have switch role', () => {
    const button = fixture.nativeElement.querySelector('[role="switch"]');
    expect(button).toBeTruthy();
  });
});
