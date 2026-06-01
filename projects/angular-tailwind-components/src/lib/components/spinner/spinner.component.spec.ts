import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindSpinner } from './spinner.component';

describe('TailwindSpinner', () => {
  let fixture: ComponentFixture<TailwindSpinner>;
  let component: TailwindSpinner;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindSpinner]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use arrow-path as default icon', () => {
    expect(component.icon()).toBe('arrow-path');

    const glyph: HTMLElement = fixture.nativeElement.querySelector('.tailwind-icon-glyph');
    expect(glyph.style.maskImage).toContain('/tailwind-icons/arrow-path.svg');
  });

  it('should render a custom icon when icon input is set', () => {
    fixture.componentRef.setInput('icon', 'arrow-path-rounded-square');
    fixture.detectChanges();

    const glyph: HTMLElement = fixture.nativeElement.querySelector('.tailwind-icon-glyph');
    expect(glyph.style.maskImage).toContain('/tailwind-icons/arrow-path-rounded-square.svg');
  });
});
