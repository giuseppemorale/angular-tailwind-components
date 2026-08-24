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

  // The panel is rendered into the CDK overlay container, outside the fixture's own DOM.
  function dialog(): HTMLElement | null {
    return document.querySelector('.cdk-overlay-container [role="dialog"]');
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
    expect(document.querySelector('.cdk-overlay-container h2')?.getAttribute('id')).toBe(labelledBy);
  });

  it('should fall back to ariaLabel when no title is given', () => {
    fixture.componentRef.setInput('ariaLabel', 'Side panel');
    component.open();
    fixture.detectChanges();

    expect(dialog()?.getAttribute('aria-label')).toBe('Side panel');
    expect(dialog()?.getAttribute('aria-labelledby')).toBeNull();
  });

  /** The global position strategy aligns through the overlay wrapper's flexbox. */
  function wrapper(): HTMLElement | null {
    return dialog()?.closest('.cdk-global-overlay-wrapper') as HTMLElement | null;
  }

  it('should pin the pane to the requested edge', () => {
    fixture.componentRef.setInput('position', 'left');
    component.open();
    fixture.detectChanges();

    expect(wrapper()?.style.justifyContent).toBe('flex-start');
    expect(dialog()?.className).toContain('max-w-md');
    expect(dialog()?.className).toContain('h-screen');
  });

  it('should pin a bottom sheet to the bottom edge and cap its height', () => {
    fixture.componentRef.setInput('position', 'bottom');
    component.open();
    fixture.detectChanges();

    expect(wrapper()?.style.alignItems).toBe('flex-end');
    expect(dialog()?.className).toContain('max-h-96');
    expect(dialog()?.className).toContain('w-screen');
  });

  it('should hide the close button when showCloseButton is false', () => {
    component.open();
    fixture.componentRef.setInput('showCloseButton', false);
    fixture.detectChanges();

    expect(document.querySelector('.cdk-overlay-container tailwind-button')).toBeNull();
  });

  it('should emit onClose after the exit animation', async () => {
    const spy = vi.fn();
    component.closed.subscribe(spy);

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

    expect(document.querySelector('.cdk-overlay-container button[aria-label="Chiudi"]')).toBeTruthy();
    localized.destroy();
  });
});
