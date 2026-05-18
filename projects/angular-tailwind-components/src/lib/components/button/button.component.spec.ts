import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindButton } from './button.component';

describe('TailwindButton', () => {
  let fixture: ComponentFixture<TailwindButton>;
  let component: TailwindButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindButton]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when clicked', () => {
    const spy = vi.fn();
    component.onClick.subscribe(spy);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit clicked event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.onClick.subscribe(spy);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should have disabled attribute when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('should apply color and kind classes', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.componentRef.setInput('kind', 'solid');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('bg-danger-600');
    expect(button.className).toContain('text-on-danger-600');
  });

  it('should apply flat kind without shadow or border', () => {
    fixture.componentRef.setInput('kind', 'flat');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.className).toContain('shadow-none');
    expect(button.className).toContain('border-0');
    expect(button.className).not.toContain('shadow-sm');
  });
});
