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
    expect(surface.className).toContain('bg-surface');
    expect(host.classList.contains('custom-forwarded')).toBe(false);
    expect(host.classList.contains('h-full')).toBe(false);
  });

  it('should use flex column layout on the surface for internal structure', () => {
    const surface = host.firstElementChild as HTMLElement;
    expect(surface.className).toContain('flex');
    expect(surface.className).toContain('flex-col');
  });

  it('should pad every slot generously at the default comfortable density', () => {
    const surface = host.firstElementChild as HTMLElement;
    const [header, body, footer] = Array.from(surface.children) as HTMLElement[];

    expect(header.className).toContain('px-6');
    expect(body.className).toContain('p-6');
    expect(footer.className).toContain('px-6');
  });

  it('should tighten every slot at compact density', () => {
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();

    const surface = host.firstElementChild as HTMLElement;
    const [header, body, footer] = Array.from(surface.children) as HTMLElement[];

    expect(header.className).toContain('px-4');
    expect(body.className).toContain('p-4');
    expect(footer.className).toContain('px-4');
    expect(body.className).not.toContain('p-6');
  });

  it('should tint the header only when headerBg is set, swapping the rule for the fill', () => {
    const header = () => host.firstElementChild!.firstElementChild as HTMLElement;
    expect(header().className).not.toContain('bg-surface-subtle');
    expect(header().className).toContain('border-b');

    fixture.componentRef.setInput('headerBg', true);
    fixture.detectChanges();
    expect(header().className).toContain('bg-surface-subtle');
    expect(header().className).not.toContain('border-b');
  });

  it('should tint the footer only when footerBg is set, swapping the rule for the fill', () => {
    const footer = () => host.firstElementChild!.lastElementChild as HTMLElement;
    expect(footer().className).not.toContain('bg-surface-subtle');
    expect(footer().className).toContain('border-t');

    fixture.componentRef.setInput('footerBg', true);
    fixture.detectChanges();
    expect(footer().className).toContain('bg-surface-subtle');
    expect(footer().className).not.toContain('border-t');
  });
});
