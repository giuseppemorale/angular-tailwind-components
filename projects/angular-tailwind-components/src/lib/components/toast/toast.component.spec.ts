import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindToastService } from '../../services';
import { TailwindToast } from './toast.component';

describe('TailwindToast', () => {
  let fixture: ComponentFixture<TailwindToast>;
  let component: TailwindToast;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindToast],
      providers: [TailwindToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should position container top-right by default', () => {
    const container = fixture.nativeElement.querySelector('.fixed');
    expect(container?.className).toContain('top-8');
    expect(container?.className).toContain('right-8');
  });

  it('should position container bottom-left when configured', () => {
    fixture.componentRef.setInput('vertical', 'bottom');
    fixture.componentRef.setInput('horizontal', 'left');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.fixed');
    expect(container?.className).toContain('bottom-8');
    expect(container?.className).toContain('left-8');
  });

  it('should use slide-in-from-left-full when horizontal is left', () => {
    fixture.componentRef.setInput('horizontal', 'left');
    fixture.detectChanges();

    expect(component.enterAnimationClass()).toBe('slide-in-from-left-full');
  });

  it('should use slide-in-from-bottom-full when vertical is bottom and horizontal is right', () => {
    fixture.componentRef.setInput('vertical', 'bottom');
    fixture.detectChanges();

    expect(component.enterAnimationClass()).toBe('slide-in-from-bottom-full');
  });
});
