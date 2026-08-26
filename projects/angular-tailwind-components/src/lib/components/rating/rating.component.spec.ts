import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindRating } from './rating.component';

describe('TailwindRating', () => {
  let fixture: ComponentFixture<TailwindRating>;
  let component: TailwindRating;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindRating]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindRating);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function widget(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="slider"], [role="img"]');
  }

  function stars(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('tailwind-icon'));
  }

  function press(key: string): void {
    widget().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render five stars by default', () => {
    expect(stars().length).toBe(5);
  });

  it('should expose slider semantics while interactive', () => {
    const el = widget();
    expect(el.getAttribute('role')).toBe('slider');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('5');
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('should drop the slider semantics when read-only', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    const el = widget();
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('tabindex')).toBeNull();
  });

  it('should set the rating on click', () => {
    stars()[2].click();
    fixture.detectChanges();

    expect(component.value()).toBe(3);
    expect(widget().getAttribute('aria-valuenow')).toBe('3');
  });

  it('should clear the rating when the current value is picked again', () => {
    stars()[2].click();
    fixture.detectChanges();
    stars()[2].click();
    fixture.detectChanges();

    expect(component.value()).toBe(0);
  });

  it('should keep the value when clearable is off', () => {
    fixture.componentRef.setInput('clearable', false);
    stars()[1].click();
    fixture.detectChanges();
    stars()[1].click();
    fixture.detectChanges();

    expect(component.value()).toBe(2);
  });

  it('should adjust with the arrow keys and clamp at both ends', () => {
    press('ArrowRight');
    expect(component.value()).toBe(1);

    press('End');
    expect(component.value()).toBe(5);

    press('ArrowRight');
    expect(component.value()).toBe(5);

    press('Home');
    expect(component.value()).toBe(0);
  });

  it('should not react to the keyboard when read-only', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();

    press('ArrowRight');
    expect(component.value()).toBe(0);
  });

  it('should describe the value in words for assistive technology', () => {
    component.writeValue(3);
    fixture.detectChanges();

    expect(widget().getAttribute('aria-valuetext')).toBe('3 of 5');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue(4);
    expect(component.value()).toBe(4);

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
    expect(component.isInteractive()).toBe(false);
  });
});
