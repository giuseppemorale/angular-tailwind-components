import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindOrderList } from './order-list.component';

interface Track {
  id: number;
  title: string;
}

const TRACKS: Track[] = [
  { id: 1, title: 'Intro' },
  { id: 2, title: 'Verse' },
  { id: 3, title: 'Chorus' },
  { id: 4, title: 'Outro' }
];

describe('TailwindOrderList', () => {
  let fixture: ComponentFixture<TailwindOrderList<Track>>;
  let component: TailwindOrderList<Track>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindOrderList]
    }).compileComponents();

    fixture = TestBed.createComponent<TailwindOrderList<Track>>(TailwindOrderList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [...TRACKS]);
    fixture.componentRef.setInput('optionLabel', 'title');
    fixture.detectChanges();
  });

  function options(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="option"]'));
  }

  function titles(): (string | undefined)[] {
    return component.items().map(track => track.title);
  }

  function buttonFor(label: string): HTMLButtonElement {
    return fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
  }

  function press(key: string, init: KeyboardEventInit = {}): void {
    fixture.nativeElement
      .querySelector('[role="listbox"]')
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render one option per item, labelled through optionLabel', () => {
    expect(options().map(option => option.textContent?.trim())).toEqual(['Intro', 'Verse', 'Chorus', 'Outro']);
  });

  it('should expose the multi-select listbox pattern', () => {
    const listbox: HTMLElement = fixture.nativeElement.querySelector('[role="listbox"]');

    expect(listbox.getAttribute('aria-multiselectable')).toBe('true');
    expect(listbox.getAttribute('tabindex')).toBe('0');
    expect(listbox.getAttribute('aria-activedescendant')).toBe(options()[0].id);
    expect(options().every(option => option.getAttribute('aria-selected') === 'false')).toBe(true);
  });

  it('should fall back to the header for the accessible name, then to the shared label', () => {
    const listbox = (): HTMLElement => fixture.nativeElement.querySelector('[role="listbox"]');
    expect(listbox().getAttribute('aria-label')).toBe('Order list');

    fixture.componentRef.setInput('header', 'Playlist');
    fixture.detectChanges();
    expect(listbox().getAttribute('aria-label')).toBe('Playlist');

    fixture.componentRef.setInput('ariaLabel', 'Track order');
    fixture.detectChanges();
    expect(listbox().getAttribute('aria-label')).toBe('Track order');
  });

  it('should select a single row on click', () => {
    options()[2].click();
    fixture.detectChanges();

    expect(component.selection()).toEqual([TRACKS[2]]);
    expect(options()[2].getAttribute('aria-selected')).toBe('true');
  });

  it('should toggle with Ctrl+click and extend with Shift+click', () => {
    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    options()[2].dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: true }));
    fixture.detectChanges();
    expect(component.selection().map(track => track.id)).toEqual([1, 3]);

    options()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    options()[2].dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    fixture.detectChanges();
    expect(component.selection().map(track => track.id)).toEqual([1, 2, 3]);
  });

  it('should keep the reorder buttons disabled while nothing is selected', () => {
    expect(buttonFor('Move up').disabled).toBe(true);
    expect(buttonFor('Move to top').disabled).toBe(true);
    expect(buttonFor('Move down').disabled).toBe(true);
    expect(buttonFor('Move to bottom').disabled).toBe(true);
  });

  it('should move the selection with the side buttons and emit the new order', () => {
    const spy = vi.fn();
    component.reorder.subscribe(spy);

    options()[2].click();
    fixture.detectChanges();

    buttonFor('Move up').click();
    fixture.detectChanges();
    expect(titles()).toEqual(['Intro', 'Chorus', 'Verse', 'Outro']);
    expect(spy).toHaveBeenCalledTimes(1);

    buttonFor('Move to bottom').click();
    fixture.detectChanges();
    expect(titles()).toEqual(['Intro', 'Verse', 'Outro', 'Chorus']);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should disable the up buttons once the selection sits at the top', () => {
    options()[0].click();
    fixture.detectChanges();

    expect(buttonFor('Move up').disabled).toBe(true);
    expect(buttonFor('Move to top').disabled).toBe(true);
    expect(buttonFor('Move down').disabled).toBe(false);
  });

  it('should announce the new position in the live region', () => {
    options()[0].click();
    fixture.detectChanges();
    buttonFor('Move to bottom').click();
    fixture.detectChanges();

    const live: HTMLElement = fixture.nativeElement.querySelector('[aria-live="polite"]');
    expect(live.textContent?.trim()).toBe('Intro moved to position 4 of 4');
  });

  it('should walk the active option with the arrows and select as it goes', () => {
    const listbox: HTMLElement = fixture.nativeElement.querySelector('[role="listbox"]');

    press('ArrowDown');
    expect(listbox.getAttribute('aria-activedescendant')).toBe(options()[1].id);
    expect(component.selection().map(track => track.id)).toEqual([2]);

    press('End');
    expect(component.selection().map(track => track.id)).toEqual([4]);

    press('Home');
    expect(component.selection().map(track => track.id)).toEqual([1]);
  });

  it('should grow a Shift range from a fixed anchor instead of sliding it', () => {
    press('ArrowDown'); // anchor on "Verse"
    press('ArrowDown', { shiftKey: true });
    expect(component.selection().map(track => track.id)).toEqual([2, 3]);

    press('ArrowDown', { shiftKey: true });
    expect(component.selection().map(track => track.id)).toEqual([2, 3, 4]);
  });

  it('should toggle with Space and select all with Ctrl+A', () => {
    press(' ');
    expect(component.selection().map(track => track.id)).toEqual([1]);

    press(' ');
    expect(component.selection()).toEqual([]);

    press('a', { ctrlKey: true });
    expect(component.selection().length).toBe(4);
  });

  it('should reorder with Alt+Arrow without moving the active row', () => {
    options()[1].click();
    fixture.detectChanges();

    press('ArrowDown', { altKey: true });
    expect(titles()).toEqual(['Intro', 'Chorus', 'Verse', 'Outro']);
    expect(component.selection().map(track => track.id)).toEqual([2]);
  });

  it('should filter the rendered rows without touching the underlying order', () => {
    fixture.componentRef.setInput('filterable', true);
    fixture.detectChanges();

    component['onFilterChange']('ro');
    fixture.detectChanges();

    expect(options().map(option => option.textContent?.trim())).toEqual(['Intro', 'Outro']);
    expect(titles()).toEqual(['Intro', 'Verse', 'Chorus', 'Outro']);
  });

  it('should show the empty message when nothing is rendered', () => {
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('emptyMessage', 'Nothing here');
    fixture.detectChanges();

    expect(options().length).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Nothing here');
  });

  it('should match items by dataKey when the objects are recreated', () => {
    fixture.componentRef.setInput('dataKey', 'id');
    fixture.componentRef.setInput('selection', [{ id: 3, title: 'Chorus' }]);
    fixture.detectChanges();

    expect(options()[2].getAttribute('aria-selected')).toBe('true');
    expect(component.selectedIndices()).toEqual([2]);
  });

  it('should refuse every interaction while disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const listbox: HTMLElement = fixture.nativeElement.querySelector('[role="listbox"]');
    expect(listbox.getAttribute('aria-disabled')).toBe('true');
    expect(listbox.getAttribute('tabindex')).toBe('-1');
    expect(options()[0].getAttribute('draggable')).toBeNull();

    options()[1].click();
    press('ArrowDown');
    expect(component.selection()).toEqual([]);
    expect(buttonFor('Move down').disabled).toBe(true);
  });

  it('should reorder on drop, mapping the rendered positions back onto the items', () => {
    const spy = vi.fn();
    component.reorder.subscribe(spy);
    const transfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' };

    options()[0].dispatchEvent(Object.assign(new Event('dragstart', { bubbles: true }), { dataTransfer: transfer }));
    options()[2].dispatchEvent(Object.assign(new Event('dragover', { bubbles: true }), { dataTransfer: transfer }));
    options()[2].dispatchEvent(Object.assign(new Event('drop', { bubbles: true }), { dataTransfer: transfer }));
    fixture.detectChanges();

    expect(titles()).toEqual(['Verse', 'Chorus', 'Intro', 'Outro']);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
