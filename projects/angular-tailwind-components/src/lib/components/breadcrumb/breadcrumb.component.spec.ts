import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindBreadcrumb } from './breadcrumb.component';

const ITEMS = [
  { label: 'Home', link: '/' },
  { label: 'Invoices', link: '/invoices', icon: 'document-text' as const },
  { label: 'INV-42' }
];

describe('TailwindBreadcrumb', () => {
  let fixture: ComponentFixture<TailwindBreadcrumb>;
  let component: TailwindBreadcrumb;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindBreadcrumb],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindBreadcrumb);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a named navigation landmark holding an ordered list', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(nav.querySelector('ol')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(3);
  });

  it('should link every item except the last', () => {
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('INV-42');
  });

  it('should mark the last item as the current page', () => {
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('INV-42');
  });

  /** Icons also carry `aria-hidden`, so match the separator by its own class. */
  function separators(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('span.mx-2[aria-hidden="true"]'));
  }

  it('should hide the separators from assistive technology', () => {
    // One between each pair of crumbs.
    expect(separators().length).toBe(2);
    expect(separators()[0].textContent?.trim()).toBe('>');
  });

  it('should accept a custom separator', () => {
    fixture.componentRef.setInput('separator', '/');
    fixture.detectChanges();

    expect(separators()[0].textContent?.trim()).toBe('/');
  });

  it('should render an item icon when given', () => {
    expect(fixture.nativeElement.querySelectorAll('tailwind-icon').length).toBe(1);
  });
});
