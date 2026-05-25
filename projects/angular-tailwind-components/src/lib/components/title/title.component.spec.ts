import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_TAILWIND_TITLE_SCALE } from '../../models';
import { TAILWIND_TITLE_SCALE } from '../../tokens';
import { TailwindTitle } from './title.component';

describe('TailwindTitle', () => {
  let fixture: ComponentFixture<TailwindTitle>;
  let component: TailwindTitle;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindTitle]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTitle);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Hello');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default h2 typography classes', () => {
    const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h2');
    for (const cls of DEFAULT_TAILWIND_TITLE_SCALE.h2.classes.split(/\s+/)) {
      expect(heading.classList.contains(cls)).toBe(true);
    }
    expect(heading.textContent?.trim()).toBe('Hello');
  });

  it('should apply titleTag scale classes', () => {
    fixture.componentRef.setInput('titleTag', 'h1');
    fixture.detectChanges();

    const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
    for (const cls of DEFAULT_TAILWIND_TITLE_SCALE.h1.classes.split(/\s+/)) {
      expect(heading.classList.contains(cls)).toBe(true);
    }
  });

  it('should use TAILWIND_TITLE_SCALE when provided', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindTitle],
      providers: [
        {
          provide: TAILWIND_TITLE_SCALE,
          useValue: {
            ...DEFAULT_TAILWIND_TITLE_SCALE,
            h2: { classes: 'text-4xl font-black text-neutral-600', iconSize: 40 }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTitle);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', 'Themed');
    fixture.detectChanges();

    const heading: HTMLHeadingElement = fixture.nativeElement.querySelector('h2');
    expect(heading.className).toContain('text-4xl');
    expect(heading.className).toContain('text-neutral-600');
    expect(component.iconSize()).toBe(40);
  });
});
