import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindMenuItem } from '../../models';
import { TailwindMenu } from './menu.component';

const ITEMS: TailwindMenuItem[] = [
  { label: 'Edit', value: 'edit' },
  { label: 'Duplicate', value: 'duplicate' },
  { divider: true },
  { label: 'Delete', value: 'delete', disabled: true },
  { label: 'Archive', value: 'archive' }
];

describe('TailwindMenu', () => {
  let fixture: ComponentFixture<TailwindMenu>;
  let component: TailwindMenu;
  let anchor: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindMenu]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindMenu);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();

    anchor = document.createElement('button');
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    fixture.destroy();
    anchor.remove();
  });

  // The panel is rendered into the CDK overlay container, outside the fixture's own DOM.
  function panel(): HTMLElement | null {
    return document.querySelector('.cdk-overlay-container [role="menu"]');
  }

  function menuItems(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll('.cdk-overlay-container [role="menuitem"]'));
  }

  /** Opening is deferred one macrotask so the triggering click cannot close it again. */
  async function openMenu(): Promise<void> {
    component.open(anchor);
    await settle();
  }

  /** Opens from a real click on the anchor; `detail` is 0 when Enter / Space fired it, > 0 for a pointer. */
  async function openMenuWithClick(detail: number): Promise<void> {
    anchor.addEventListener('click', event => component.open(event), { once: true });
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }));
    await settle();
  }

  async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => requestAnimationFrame(() => resolve(null)));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nothing until opened', () => {
    expect(panel()).toBeNull();
  });

  it('should render one menuitem per non-divider entry', async () => {
    await openMenu();

    expect(panel()).not.toBeNull();
    expect(menuItems().map(b => b.textContent?.trim())).toEqual(['Edit', 'Duplicate', 'Delete', 'Archive']);
    expect(document.querySelectorAll('.cdk-overlay-container hr').length).toBe(1);
  });

  // The CDK pane is `display: flex` and at least MIN_PANEL_WIDTH_PX wide: a panel that shrinks to its
  // entries sits at the pane's left edge, so with `align="right"` it no longer ends under the anchor.
  it('should fill the overlay pane so align="right" ends at the anchor edge', async () => {
    fixture.componentRef.setInput('align', 'right');
    await openMenu();

    expect(panel()?.classList).toContain('w-full');
  });

  it('should move focus into the menu on open', async () => {
    await openMenu();
    expect(document.activeElement).toBe(menuItems()[0]);
  });

  it('should focus the first entry when opened from the keyboard', async () => {
    await openMenuWithClick(0);
    expect(document.activeElement).toBe(menuItems()[0]);
  });

  // Focusing the first entry after a mouse click paints the browser focus ring on it, which reads as a
  // pre-selected choice. The panel takes focus instead, so the keyboard still works from there.
  it('should focus the panel, not an entry, when opened with the pointer', async () => {
    await openMenuWithClick(1);
    expect(document.activeElement).toBe(panel());
  });

  it('should enter at the first entry with ArrowDown after a pointer open', async () => {
    await openMenuWithClick(1);

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(menuItems()[0]);
  });

  it('should enter at the last enabled entry with ArrowUp after a pointer open', async () => {
    await openMenuWithClick(1);

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(menuItems()[3]);
  });

  it('should still close on Escape after a pointer open', async () => {
    await openMenuWithClick(1);

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('should walk enabled entries with the arrow keys, skipping disabled ones', async () => {
    await openMenu();
    const items = menuItems();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    // "Delete" is disabled, so it is not part of the focus ring at all.
    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[3]);
  });

  it('should wrap around with ArrowUp from the first entry', async () => {
    await openMenu();
    const items = menuItems();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(items[items.length - 1]);
  });

  it('should jump to the first and last entry with Home and End', async () => {
    await openMenu();
    const items = menuItems();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement).toBe(items[items.length - 1]);

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('should emit onSelect and close when an entry is activated', async () => {
    const spy = vi.fn();
    component.itemSelect.subscribe(spy);
    await openMenu();

    menuItems()[0].click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].value).toBe('edit');
    expect(panel()).toBeNull();
  });

  it('should not emit for a disabled entry', async () => {
    const spy = vi.fn();
    component.itemSelect.subscribe(spy);
    await openMenu();

    menuItems()[2].click();
    fixture.detectChanges();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should return focus to the anchor after selecting', async () => {
    await openMenu();
    menuItems()[0].click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(anchor);
  });

  it('should close on Escape', async () => {
    await openMenu();

    // The CDK keyboard dispatcher listens on `body`, so the event has to bubble up from the panel.
    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });

  it('should close when Tab leaves the menu', async () => {
    await openMenu();

    panel()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();

    expect(panel()).toBeNull();
  });
});
