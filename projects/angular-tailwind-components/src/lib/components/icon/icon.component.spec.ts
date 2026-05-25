import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindIcon } from './icon.component';

describe('TailwindIcon', () => {
  let fixture: ComponentFixture<TailwindIcon>;
  let component: TailwindIcon;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindIcon]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindIcon);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('icon', 'bell');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a masked glyph with size and icon mask', () => {
    fixture.componentRef.setInput('size', 32);
    fixture.detectChanges();

    const glyph: HTMLElement = fixture.nativeElement.querySelector('.tailwind-icon-glyph');
    expect(glyph).toBeTruthy();
    expect(glyph.style.width).toBe('32px');
    expect(glyph.style.height).toBe('32px');
    expect(glyph.style.maskImage).toContain('/tailwind-icons/bell.svg');
  });

  it('should apply custom class to the inner glyph, not only the host', () => {
    fixture.componentRef.setInput('class', 'text-danger-600 shrink-0');
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    const glyph: HTMLElement = fixture.nativeElement.querySelector('.tailwind-icon-glyph');

    expect(glyph.classList.contains('text-danger-600')).toBe(true);
    expect(glyph.classList.contains('shrink-0')).toBe(true);
    expect(host.classList.contains('inline-flex')).toBe(true);
    expect(host.classList.contains('items-center')).toBe(true);
  });

  it('should clamp size below minimum and above maximum', () => {
    fixture.componentRef.setInput('size', 8);
    fixture.detectChanges();
    let glyph: HTMLElement = fixture.nativeElement.querySelector('.tailwind-icon-glyph');
    expect(glyph.style.width).toBe('16px');

    fixture.componentRef.setInput('size', 100);
    fixture.detectChanges();
    glyph = fixture.nativeElement.querySelector('.tailwind-icon-glyph');
    expect(glyph.style.width).toBe('64px');
  });
});
