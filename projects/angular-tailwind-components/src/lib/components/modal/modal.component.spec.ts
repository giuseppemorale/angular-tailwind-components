import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resolveTailwindLabels } from '../../models';
import { TAILWIND_LABELS } from '../../tokens';
import { TailwindModal } from './modal.component';

/** The exit animation is driven by a timer; advance past it to reach the closed state. */
const EXIT_ANIMATION_MS = 200;

@Component({
  imports: [TailwindModal],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-modal>
      Dialog title
      <div tailwind-modal-content>Projected body</div>
      <div tailwind-modal-footer><button type="button">OK</button></div>
    </tailwind-modal>
  `
})
class ModalHostComponent {
  readonly modal = viewChild.required(TailwindModal);
}

describe('TailwindModal', () => {
  let fixture: ComponentFixture<TailwindModal>;
  let component: TailwindModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindModal, ModalHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Destroying disposes the overlay, so a dialog left open cannot leak into the next test.
  afterEach(() => fixture.destroy());

  /** The panel now renders into the CDK overlay container, outside the fixture's DOM. */
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

  it('should name the dialog with its own title element', () => {
    component.open();
    fixture.detectChanges();

    const labelledBy = dialog()?.getAttribute('aria-labelledby');
    const title = document.querySelector('.cdk-overlay-container h2');
    expect(labelledBy).toBeTruthy();
    expect(title?.getAttribute('id')).toBe(labelledBy);
  });

  // Page scroll blocking is delegated to the CDK block strategy, which no-ops on a document that
  // cannot scroll — so jsdom cannot observe it. What is verifiable here is that stacked dialogs
  // own independent overlays and tear down one at a time.
  it('should let stacked dialogs close independently', async () => {
    const second = TestBed.createComponent(TailwindModal);

    component.open();
    second.componentInstance.open();
    fixture.detectChanges();
    second.detectChanges();
    expect(document.querySelectorAll('.cdk-overlay-container [role="dialog"]').length).toBe(2);

    second.componentInstance.close();
    await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
    expect(document.querySelectorAll('.cdk-overlay-container [role="dialog"]').length).toBe(1);

    component.close();
    await settleClose();
    expect(document.querySelectorAll('.cdk-overlay-container [role="dialog"]').length).toBe(0);
    second.destroy();
  });

  it('should return focus to the element that opened it', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    component.open();
    fixture.detectChanges();

    component.close();
    await settleClose();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
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

  it('should close on Escape when closeOnEscape is true', async () => {
    component.open();
    fixture.detectChanges();

    dialog()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settleClose();

    expect(dialog()).toBeNull();
  });

  it('should ignore Escape when closeOnEscape is false', async () => {
    fixture.componentRef.setInput('closeOnEscape', false);
    component.open();
    fixture.detectChanges();

    dialog()?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await settleClose();

    expect(dialog()).not.toBeNull();
  });

  it('should close on backdrop click only when closeOnBackdrop is true', async () => {
    fixture.componentRef.setInput('closeOnBackdrop', false);
    component.open();
    fixture.detectChanges();

    const backdrop: HTMLElement | null = document.querySelector('.tailwind-modal-backdrop');
    expect(backdrop).not.toBeNull();
    backdrop?.click();
    await settleClose();

    expect(dialog()).not.toBeNull();
  });

  it('should hide the close button when showCloseButton is false', () => {
    fixture.componentRef.setInput('showCloseButton', false);
    component.open();
    fixture.detectChanges();

    expect(document.querySelector('.cdk-overlay-container tailwind-button')).toBeNull();
  });

  // A panel stretched by the flex pane kept the pane's capped height while a tall body spilled out of it.
  it('should cap the panel at the viewport and scroll only the body', () => {
    component.open();
    fixture.detectChanges();

    const panel = dialog() as HTMLElement;
    const body = panel.querySelector('[data-modal-body]') as HTMLElement;
    expect(panel.classList).toContain('max-h-[calc(100vh-2rem)]');
    expect(panel.classList).toContain('flex-col');
    expect(body.classList).toContain('overflow-y-auto');
    expect(body.classList).toContain('min-h-0');
  });

  it('should size the overlay pane from the size input', () => {
    fixture.componentRef.setInput('size', 'xl');
    component.open();
    fixture.detectChanges();

    const pane = dialog()?.closest('.cdk-overlay-pane') as HTMLElement | null;
    expect(pane?.style.maxWidth).toBe('56rem');
  });

  it('should let an explicit maxWidth override the size', () => {
    fixture.componentRef.setInput('size', 'xl');
    fixture.componentRef.setInput('maxWidth', '72rem');
    component.open();
    fixture.detectChanges();

    const pane = dialog()?.closest('.cdk-overlay-pane') as HTMLElement | null;
    expect(pane?.style.maxWidth).toBe('72rem');
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

    expect(document.querySelector('.cdk-overlay-container button[aria-label="Chiudi"]')).toBeTruthy();
    localized.destroy();
  });

  it('should prefer the closeLabel input over the token default', () => {
    fixture.componentRef.setInput('closeLabel', 'Dismiss dialog');
    component.open();
    fixture.detectChanges();

    expect(document.querySelector('.cdk-overlay-container button[aria-label="Dismiss dialog"]')).toBeTruthy();
  });

  describe('content projection', () => {
    let host: ComponentFixture<ModalHostComponent>;

    beforeEach(() => {
      host = TestBed.createComponent(ModalHostComponent);
      host.detectChanges();
    });

    afterEach(() => host.destroy());

    function panelText(): string {
      return document.querySelector('.cdk-overlay-container [role="dialog"]')?.textContent ?? '';
    }

    it('should project all three slots into the overlay', () => {
      host.componentInstance.modal().open();
      host.detectChanges();

      expect(panelText()).toContain('Dialog title');
      expect(panelText()).toContain('Projected body');
      expect(panelText()).toContain('OK');
    });

    it('should keep the projected content across close and reopen', async () => {
      const modal = host.componentInstance.modal();

      modal.open();
      host.detectChanges();
      expect(panelText()).toContain('Projected body');

      modal.close();
      await new Promise(resolve => setTimeout(resolve, EXIT_ANIMATION_MS + 20));
      host.detectChanges();
      expect(document.querySelector('.cdk-overlay-container [role="dialog"]')).toBeNull();

      modal.open();
      host.detectChanges();
      expect(panelText()).toContain('Dialog title');
      expect(panelText()).toContain('Projected body');
      expect(panelText()).toContain('OK');
    });
  });
});
