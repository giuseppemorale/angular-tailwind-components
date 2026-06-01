import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindAvatar } from './avatar.component';

describe('TailwindAvatar', () => {
  let fixture: ComponentFixture<TailwindAvatar>;
  let component: TailwindAvatar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindAvatar]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive initials from name', () => {
    fixture.componentRef.setInput('name', 'Giuseppe Morale');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('GM');
  });

  it('should use explicit initials when provided', () => {
    fixture.componentRef.setInput('name', 'Giuseppe Morale');
    fixture.componentRef.setInput('initials', 'AB');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('AB');
  });

  it('should render image when src is provided', () => {
    fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
  });

  it('should fall back to user icon when no src or initials', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tailwind-icon')).toBeTruthy();
  });

  it('should expose accessible label from name', () => {
    fixture.componentRef.setInput('name', 'Giuseppe Morale');
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('[role="img"]');
    expect(host?.getAttribute('aria-label')).toBe('Giuseppe Morale');
  });

  it('should render status dot when status is set', () => {
    fixture.componentRef.setInput('name', 'Test User');
    fixture.componentRef.setInput('status', 'success');
    fixture.detectChanges();

    const dot = fixture.nativeElement.querySelector('.avatar-status.bg-success-600');
    expect(dot).toBeTruthy();
  });
});
