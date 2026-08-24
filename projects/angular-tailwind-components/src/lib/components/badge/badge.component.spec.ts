import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TAILWIND_COMPONENTS_SIZE } from '../../tokens';
import { TailwindBadge } from './badge.component';

describe('TailwindBadge', () => {
  let fixture: ComponentFixture<TailwindBadge>;
  let component: TailwindBadge;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindBadge]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function surface(): HTMLElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should paint the primary colour by default', () => {
    expect(surface().className).toContain('primary');
  });

  it('should switch palette with the color input', () => {
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();
    expect(surface().className).toContain('danger');
  });

  it('should render a leading dot only when asked', () => {
    expect(surface().querySelector('.rounded-full')).toBeNull();

    fixture.componentRef.setInput('dot', true);
    fixture.detectChanges();
    expect(surface().querySelector('.rounded-full')).toBeTruthy();
  });

  it('should expose an accessible name when given', () => {
    fixture.componentRef.setInput('ariaLabel', '3 unread');
    fixture.detectChanges();
    expect(surface().getAttribute('aria-label')).toBe('3 unread');
  });

  it('should take its default size from TAILWIND_COMPONENTS_SIZE', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindBadge],
      providers: [{ provide: TAILWIND_COMPONENTS_SIZE, useValue: 'xl' }]
    }).compileComponents();

    const tokenFixture = TestBed.createComponent(TailwindBadge);
    tokenFixture.detectChanges();

    expect(tokenFixture.componentInstance.size()).toBe('xl');
  });
});
