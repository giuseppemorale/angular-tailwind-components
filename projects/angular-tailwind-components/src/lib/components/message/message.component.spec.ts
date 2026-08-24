import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindMessage } from './message.component';

describe('TailwindMessage', () => {
  let fixture: ComponentFixture<TailwindMessage>;
  let component: TailwindMessage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindMessage]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function surface(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="status"]');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should announce politely rather than interrupt', () => {
    expect(surface()).toBeTruthy();
  });

  it('should default to the info palette', () => {
    expect(surface().className).toContain('info');
  });

  it('should switch palette with the color input', () => {
    fixture.componentRef.setInput('color', 'warning');
    fixture.detectChanges();
    expect(surface().className).toContain('warning');
  });

  it('should render an icon only when one is given', () => {
    expect(fixture.nativeElement.querySelector('tailwind-icon')).toBeNull();

    fixture.componentRef.setInput('icon', 'information-circle');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tailwind-icon')).toBeTruthy();
  });
});
