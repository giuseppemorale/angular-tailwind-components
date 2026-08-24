import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindDivider } from './divider.component';

describe('TailwindDivider', () => {
  let fixture: ComponentFixture<TailwindDivider>;
  let component: TailwindDivider;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindDivider]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindDivider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function separator(): HTMLElement {
    return fixture.nativeElement.querySelector('[role="separator"]');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the separator role', () => {
    expect(separator()).toBeTruthy();
  });

  it('should render a plain rule without a label', () => {
    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('should render the label between two rules and name the separator with it', () => {
    fixture.componentRef.setInput('label', 'or');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')?.textContent?.trim()).toBe('or');
    expect(separator().getAttribute('aria-label')).toBe('or');
  });

  it('should ignore a label in vertical orientation', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('label', 'or');
    fixture.detectChanges();

    // A vertical rule has no room for text.
    expect(component.isLabeledHorizontal()).toBe(false);
    expect(fixture.nativeElement.querySelector('span')).toBeNull();
  });

  it('should apply the dashed variant', () => {
    fixture.componentRef.setInput('variant', 'dashed');
    fixture.detectChanges();
    expect(separator().className).toContain('dashed');
  });
});
