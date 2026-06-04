import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindCard } from './card.component';

describe('TailwindCard', () => {
  let fixture: ComponentFixture<TailwindCard>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindCard]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindCard);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply consumer class on the card surface, not only on the host', () => {
    fixture.componentRef.setInput('class', 'custom-forwarded h-full');
    fixture.detectChanges();

    const surface = host.firstElementChild as HTMLElement;
    expect(surface).toBeTruthy();
    expect(surface.className).toContain('custom-forwarded');
    expect(surface.className).toContain('h-full');
    expect(surface.className).toContain('bg-white');
    expect(host.classList.contains('custom-forwarded')).toBe(false);
    expect(host.classList.contains('h-full')).toBe(false);
  });

  it('should use flex column layout on the surface for internal structure', () => {
    const surface = host.firstElementChild as HTMLElement;
    expect(surface.className).toContain('flex');
    expect(surface.className).toContain('flex-col');
  });
});
