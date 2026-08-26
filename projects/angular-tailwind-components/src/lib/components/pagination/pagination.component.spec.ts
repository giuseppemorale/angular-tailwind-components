import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS, TAILWIND_PAGINATION_SUMMARY } from '../../tokens';
import { TailwindPagination } from './pagination.component';

describe('TailwindPagination', () => {
  let fixture: ComponentFixture<TailwindPagination>;
  let component: TailwindPagination;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindPagination]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindPagination);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('totalItems', 30);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  /** Page buttons only, excluding the previous/next arrows which carry an icon and no text. */
  function pageButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('nav button')).filter((b): b is HTMLButtonElement =>
      /^\d+$/.test((b as HTMLElement).textContent?.trim() ?? '')
    );
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose a navigation landmark', () => {
    const nav: HTMLElement = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('Pagination');
  });

  it('should render one button per page when they all fit', () => {
    expect(component.totalPages()).toBe(3);
    expect(pageButtons().map(b => b.textContent?.trim())).toEqual(['1', '2', '3']);
  });

  it('should mark the current page with aria-current', () => {
    expect(pageButtons()[0].getAttribute('aria-current')).toBe('page');
    expect(pageButtons()[1].getAttribute('aria-current')).toBeNull();
  });

  it('should collapse long page lists around the current page', () => {
    fixture.componentRef.setInput('totalItems', 1000);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    expect(component.totalPages()).toBe(100);
    // Windowed, not 100 buttons.
    expect(pageButtons().length).toBeLessThanOrEqual(component.maxVisiblePages());
    expect(pageButtons()[0].textContent?.trim()).toBe('1');
    expect(pageButtons()[pageButtons().length - 1].textContent?.trim()).toBe('100');
    expect(fixture.nativeElement.querySelectorAll('nav span[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('should keep the first and last page reachable while showing a window around the current one', () => {
    fixture.componentRef.setInput('totalItems', 1000);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.goToPage(50);
    fixture.detectChanges();

    const labels = pageButtons().map(b => b.textContent?.trim());
    expect(labels[0]).toBe('1');
    expect(labels[labels.length - 1]).toBe('100');
    expect(labels).toContain('50');
  });

  it('should emit onPageChange when a page is picked', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    pageButtons()[1].click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(2);
    expect(component.currentPage()).toBe(2);
  });

  it('should ignore out-of-range pages', () => {
    const spy = vi.fn();
    component.pageChange.subscribe(spy);

    component.goToPage(0);
    component.goToPage(99);

    expect(spy).not.toHaveBeenCalled();
    expect(component.currentPage()).toBe(1);
  });

  it('should disable the previous arrow on the first page and the next arrow on the last', () => {
    const arrows: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('nav button')).filter(
      (b): b is HTMLButtonElement => !/^\d+$/.test((b as HTMLElement).textContent?.trim() ?? '')
    );

    expect(arrows[0].disabled).toBe(true);
    expect(arrows[arrows.length - 1].disabled).toBe(false);

    component.goToPage(3);
    fixture.detectChanges();
    expect(arrows[arrows.length - 1].disabled).toBe(true);
  });

  it('should render the summary with resolved placeholders', () => {
    const summary: HTMLElement = fixture.nativeElement.querySelector('span');
    expect(summary.textContent?.trim()).toBe('Showing 1-10 of 30');
  });

  it('should reset to the first page when the page size changes', () => {
    component.goToPage(3);
    const spy = vi.fn();
    // `pageSize` is a model, so its own change output is what reports a new page size.
    component.pageSize.subscribe(spy);

    component.setPageSize(25);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(25);
    expect(component.currentPage()).toBe(1);
  });

  it('should use TAILWIND_PAGINATION_SUMMARY as the default template', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindPagination],
      providers: [{ provide: TAILWIND_PAGINATION_SUMMARY, useValue: '{start}–{end} su {total}' }]
    }).compileComponents();

    const tokenFixture = TestBed.createComponent(TailwindPagination);
    tokenFixture.componentRef.setInput('totalItems', 30);
    tokenFixture.detectChanges();

    expect(tokenFixture.nativeElement.querySelector('span').textContent?.trim()).toBe('1–10 su 30');
    tokenFixture.destroy();
  });

  it('should take control labels from TAILWIND_LABELS', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindPagination],
      providers: [
        {
          provide: TAILWIND_LABELS,
          useValue: resolveTailwindLabels({ previousPage: 'Precedente', pagination: 'Impaginazione' })
        }
      ]
    }).compileComponents();

    const localized = TestBed.createComponent(TailwindPagination);
    localized.componentRef.setInput('totalItems', 30);
    localized.detectChanges();

    expect(localized.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe('Impaginazione');
    expect(localized.nativeElement.querySelector('button[aria-label="Precedente"]')).toBeTruthy();
    localized.destroy();
  });
});
