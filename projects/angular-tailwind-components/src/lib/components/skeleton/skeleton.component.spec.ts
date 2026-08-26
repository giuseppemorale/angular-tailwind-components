import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindSkeleton } from './skeleton.component';

describe('TailwindSkeleton', () => {
  let fixture: ComponentFixture<TailwindSkeleton>;
  let component: TailwindSkeleton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindSkeleton]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function box(): HTMLElement {
    return fixture.nativeElement.querySelector('div');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stay out of the accessibility tree', () => {
    // A placeholder has no content to announce; exposing it would only add noise.
    expect(box().getAttribute('aria-hidden')).toBe('true');
  });

  it('should default to a full-width text line', () => {
    expect(box().style.width).toBe('100%');
    expect(box().style.height).toBe('1.5rem');
    expect(box().className).toContain('rounded');
  });

  it('should render a circle sized from width', () => {
    fixture.componentRef.setInput('variant', 'circle');
    fixture.componentRef.setInput('width', '3rem');
    fixture.detectChanges();

    expect(box().className).toContain('rounded-full');
    // A circle takes its height from its width rather than the text line height.
    expect(box().style.height).toBe('3rem');
  });

  it('should honour an explicit height', () => {
    fixture.componentRef.setInput('height', '10rem');
    fixture.detectChanges();
    expect(box().style.height).toBe('10rem');
  });

  it('should drop the radius for the rect variant', () => {
    fixture.componentRef.setInput('variant', 'rect');
    fixture.detectChanges();
    expect(box().className).toContain('rounded-none');
  });
});
