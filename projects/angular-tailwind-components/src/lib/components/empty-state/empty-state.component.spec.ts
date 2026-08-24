import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindEmptyState } from './empty-state.component';

describe('TailwindEmptyState', () => {
  let fixture: ComponentFixture<TailwindEmptyState>;
  let component: TailwindEmptyState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindEmptyState]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and description', () => {
    fixture.componentRef.setInput('title', 'No invoices yet');
    fixture.componentRef.setInput('description', 'They will show up here once issued.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No invoices yet');
    expect(fixture.nativeElement.textContent).toContain('They will show up here once issued.');
  });

  it('should render the title at the requested heading level', () => {
    fixture.componentRef.setInput('title', 'Nothing here');
    fixture.componentRef.setInput('headingLevel', 2);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2')?.textContent).toContain('Nothing here');
    expect(fixture.nativeElement.querySelector('h3')).toBeNull();
  });

  it('should default to an h3', () => {
    fixture.componentRef.setInput('title', 'Nothing here');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h3')).toBeTruthy();
  });

  it('should hide the icon when explicitly cleared', () => {
    expect(fixture.nativeElement.querySelector('tailwind-icon')).toBeTruthy();

    fixture.componentRef.setInput('icon', undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tailwind-icon')).toBeNull();
  });

  it('should tighten the padding in compact mode', () => {
    const spacious = fixture.nativeElement.firstElementChild.className;
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    expect(spacious).toContain('py-16');
    expect(fixture.nativeElement.firstElementChild.className).toContain('py-8');
  });
});
