import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindOption } from '../../models';
import { TailwindSegmentedControl } from './segmented-control.component';

const OPTIONS: TailwindOption<string>[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'map', label: 'Map', disabled: true },
  { value: 'chart', label: 'Chart' }
];

describe('TailwindSegmentedControl', () => {
  let fixture: ComponentFixture<TailwindSegmentedControl<string>>;
  let component: TailwindSegmentedControl<string>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindSegmentedControl]
    }).compileComponents();

    fixture = TestBed.createComponent<TailwindSegmentedControl<string>>(TailwindSegmentedControl);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.detectChanges();
  });

  function segments(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="radio"]'));
  }

  function press(key: string): void {
    fixture.nativeElement
      .querySelector('[role="radiogroup"]')
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the radio group pattern', () => {
    expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).toBeTruthy();
    expect(segments().length).toBe(4);
    expect(segments().every(s => s.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('should select a segment on click', () => {
    segments()[1].click();
    fixture.detectChanges();

    expect(component.value()).toBe('grid');
    expect(segments()[1].getAttribute('aria-checked')).toBe('true');
  });

  it('should keep a single tab stop on the selected segment', () => {
    segments()[1].click();
    fixture.detectChanges();

    expect(segments().map(s => s.getAttribute('tabindex'))).toEqual(['-1', '0', '-1', '-1']);
  });

  it('should not select a disabled segment', () => {
    segments()[2].click();
    fixture.detectChanges();
    expect(component.value()).toBeNull();
  });

  it('should walk segments with the arrows, skipping disabled ones', () => {
    segments()[1].click();
    fixture.detectChanges();

    press('ArrowRight'); // skips the disabled "Map"
    expect(component.value()).toBe('chart');

    press('ArrowRight'); // wraps around
    expect(component.value()).toBe('list');
  });

  it('should jump to the extremes with Home and End', () => {
    press('End');
    expect(component.value()).toBe('chart');

    press('Home');
    expect(component.value()).toBe('list');
  });

  it('should implement CVA writeValue and setDisabledState', () => {
    component.writeValue('map');
    fixture.detectChanges();
    expect(component.value()).toBe('map');

    component.setDisabledState(true);
    fixture.detectChanges();
    expect(component.isDisabled()).toBe(true);
    expect(segments().every(s => s.disabled)).toBe(true);
  });

  it('should notify the form when a segment is picked', () => {
    const spy = vi.fn();
    component.registerOnChange(spy);

    segments()[0].click();
    expect(spy).toHaveBeenCalledWith('list');
  });

  it('should render a decorative thumb that is hidden from assistive technology', () => {
    const thumb: HTMLElement = fixture.nativeElement.querySelector('[role="radiogroup"] > span');
    expect(thumb).toBeTruthy();
    expect(thumb.getAttribute('aria-hidden')).toBe('true');
    expect(thumb.className).toContain('bg-surface');
  });

  it('should keep the thumb transparent while nothing is selected', () => {
    const thumb: HTMLElement = fixture.nativeElement.querySelector('[role="radiogroup"] > span');
    expect(thumb.className).toContain('opacity-0');
  });

  it('should move the thumb onto the selected segment', async () => {
    component.writeValue('grid');
    fixture.detectChanges();
    // The measurement is deferred to a microtask so it reads the settled layout.
    await Promise.resolve();
    fixture.detectChanges();

    const thumb: HTMLElement = fixture.nativeElement.querySelector('[role="radiogroup"] > span');
    expect(thumb.className).toContain('opacity-100');
    expect(thumb.style.transform.startsWith('translateX(')).toBe(true);
    expect(thumb.style.width.endsWith('px')).toBe(true);
  });

  it('should not paint the selected segment with its own background any more', () => {
    component.writeValue('grid');
    fixture.detectChanges();

    expect(segments()[1].className).not.toContain('bg-surface');
    expect(segments()[1].className).toContain('text-fg');
  });
});
