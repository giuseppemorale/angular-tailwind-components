import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindDrawer } from './drawer.component';

/** The exit animation is driven by a timer; advance past it to reach the closed state. */
const EXIT_ANIMATION_MS = 300;

describe('TailwindDrawer', () => {
  let fixture: ComponentFixture<TailwindDrawer>;
  let component: TailwindDrawer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindDrawer]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindDrawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  function dialog(): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="dialog"]');
  }

  async function settleClose(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nothing until opened', () => {
    expect(dialog()).toBeNull();
  });

  it('should render a modal dialog once opened', () => {
    component.open();
    fixture.detectChanges();

    expect(dialog()?.getAttribute('aria-modal')).toBe('true');
  });

  it('should close on Escape when closeOnEscape is true', async () => {
    component.open();
    fixture.detectChanges();

    dialog()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settleClose();

    expect(dialog()).toBeNull();
  });

  it('should ignore Escape when closeOnEscape is false', async () => {
    component.open();
    fixture.componentRef.setInput('closeOnEscape', false);
    fixture.detectChanges();

    dialog()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settleClose();

    expect(dialog()).not.toBeNull();
  });

  it('should name the dialog with its title', () => {
    fixture.componentRef.setInput('title', 'Filters');
    component.open();
    fixture.detectChanges();

    const labelledBy = dialog()?.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h2')?.getAttribute('id')).toBe(labelledBy);
  });

  it('should fall back to ariaLabel when no title is given', () => {
    fixture.componentRef.setInput('ariaLabel', 'Side panel');
    component.open();
    fixture.detectChanges();

    expect(dialog()?.getAttribute('aria-label')).toBe('Side panel');
    expect(dialog()?.getAttribute('aria-labelledby')).toBeNull();
  });

  it('should slide from the requested edge', () => {
    fixture.componentRef.setInput('position', 'left');
    component.open();
    fixture.detectChanges();
    expect(dialog()?.className).toContain('left-0');

    fixture.componentRef.setInput('position', 'bottom');
    fixture.detectChanges();
    expect(dialog()?.className).toContain('bottom-0');
    expect(dialog()?.className).toContain('max-h-96');
  });

  it('should hide the close button when showCloseButton is false', () => {
    component.open();
    fixture.componentRef.setInput('showCloseButton', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tailwind-button')).toBeNull();
  });

  it('should emit onClose after the exit animation', async () => {
    const spy = vi.fn();
    component.onClose.subscribe(spy);

    component.open();
    fixture.detectChanges();
    component.close();
    expect(spy).not.toHaveBeenCalled();

    await settleClose();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should label the close button from TAILWIND_LABELS', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindDrawer],
      providers: [{ provide: TAILWIND_LABELS, useValue: resolveTailwindLabels({ close: 'Chiudi' }) }]
    }).compileComponents();

    const localized = TestBed.createComponent(TailwindDrawer);
    localized.componentInstance.open();
    localized.detectChanges();

    expect(localized.nativeElement.querySelector('button[aria-label="Chiudi"]')).toBeTruthy();
    localized.destroy();
  });
});
