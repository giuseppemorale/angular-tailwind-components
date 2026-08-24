import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindModal } from './modal.component';

/** The exit animation is driven by a timer; advance past it to reach the closed state. */
const EXIT_ANIMATION_MS = 200;

describe('TailwindModal', () => {
  let fixture: ComponentFixture<TailwindModal>;
  let component: TailwindModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindModal]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Destroying releases the shared scroll lock, so a test that opens without closing
  // cannot leak `overflow: hidden` into the next one.
  afterEach(() => fixture.destroy());

  function dialog(): HTMLElement | null {
    return fixture.nativeElement.querySelector('[role="dialog"]');
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

    const el = dialog();
    expect(el).not.toBeNull();
    expect(el?.getAttribute('aria-modal')).toBe('true');
  });

  it('should name the dialog with its own title element', () => {
    component.open();
    fixture.detectChanges();

    const labelledBy = dialog()?.getAttribute('aria-labelledby');
    const title = fixture.nativeElement.querySelector('h2');
    expect(labelledBy).toBeTruthy();
    expect(title?.getAttribute('id')).toBe(labelledBy);
  });

  it('should lock body scroll while open and release it on close', async () => {
    component.open();
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    component.close();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    fixture.detectChanges();

    expect(document.body.style.overflow).toBe('');
  });

  it('should keep the page locked until the last stacked overlay closes', async () => {
    const second = TestBed.createComponent(TailwindModal);

    component.open();
    second.componentInstance.open();
    fixture.detectChanges();
    second.detectChanges();
    expect(document.body.style.overflow).toBe('hidden');

    second.componentInstance.close();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    expect(document.body.style.overflow).toBe('hidden');

    component.close();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    expect(document.body.style.overflow).toBe('');
  });

  it('should return focus to the element that opened it', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    component.open();
    fixture.detectChanges();

    component.close();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    fixture.detectChanges();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('should emit onClose after the exit animation', async () => {
    const spy = vi.fn();
    component.onClose.subscribe(spy);

    component.open();
    fixture.detectChanges();
    component.close();

    expect(spy).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close on backdrop click only when closeOnBackdrop is true', async () => {
    component.open();
    fixture.componentRef.setInput('closeOnBackdrop', false);
    fixture.detectChanges();

    const backdrop: HTMLElement = fixture.nativeElement.querySelector('[aria-hidden="true"]');
    backdrop.click();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    fixture.detectChanges();

    expect(dialog()).not.toBeNull();
  });

  it('should hide the close button when showCloseButton is false', () => {
    component.open();
    fixture.componentRef.setInput('showCloseButton', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('tailwind-button')).toBeNull();
  });

  it('should label the close button from TAILWIND_LABELS', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TailwindModal],
      providers: [{ provide: TAILWIND_LABELS, useValue: resolveTailwindLabels({ close: 'Chiudi' }) }]
    }).compileComponents();

    const localized = TestBed.createComponent(TailwindModal);
    localized.componentInstance.open();
    localized.detectChanges();

    expect(localized.nativeElement.querySelector('button[aria-label="Chiudi"]')).toBeTruthy();
  });

  it('should prefer the closeLabel input over the token default', () => {
    component.open();
    fixture.componentRef.setInput('closeLabel', 'Dismiss dialog');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button[aria-label="Dismiss dialog"]')).toBeTruthy();
  });

  it('should apply the size variant to the panel', () => {
    component.open();
    fixture.componentRef.setInput('size', 'xl');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[tabindex="-1"]')?.className).toContain('max-w-4xl');
  });
});
