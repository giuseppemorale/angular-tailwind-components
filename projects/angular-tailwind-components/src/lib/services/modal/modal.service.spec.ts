import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindModalRef } from '../../ref/modal/modal.ref';
import { TAILWIND_MODAL_DATA } from '../../tokens';
import { TailwindModalService } from './modal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <span tailwind-modal-title>Confirm</span>
    <div tailwind-modal-content>Delete {{ data.name }}?</div>
    <div tailwind-modal-footer>
      <button type="button" data-role="confirm" (click)="ref.close(true)">Yes</button>
      <button type="button" data-role="cancel" (click)="ref.close(false)">No</button>
    </div>
  `
})
class ConfirmDialogComponent {
  readonly ref = inject<TailwindModalRef<boolean>>(TailwindModalRef);
  readonly data = inject<{ name: string }>(TAILWIND_MODAL_DATA);
}

describe('TailwindModalService', () => {
  let service: TailwindModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TailwindModalService);
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => el.remove());
  });

  function panel(): HTMLElement | null {
    return document.querySelector('.cdk-overlay-container [role="dialog"]');
  }

  function click(role: string): void {
    document.querySelector<HTMLButtonElement>(`.cdk-overlay-container [data-role="${role}"]`)?.click();
  }

  it('should project the component slots into the modal overlay', async () => {
    void service.open(ConfirmDialogComponent, { data: { name: 'Invoice 42' } });
    await new Promise(resolve => setTimeout(resolve, 30));

    expect(panel()).not.toBeNull();
    expect(panel()?.textContent).toContain('Confirm');
    expect(panel()?.textContent).toContain('Delete Invoice 42?');
    expect(panel()?.textContent).toContain('Yes');
  });

  it('should resolve with the value passed to close()', async () => {
    const result = service.open<boolean>(ConfirmDialogComponent, { data: { name: 'x' } });
    await new Promise(resolve => setTimeout(resolve, 30));

    click('confirm');
    await expect(result).resolves.toBe(true);
  });

  it('should tear the overlay down once resolved', async () => {
    const result = service.open<boolean>(ConfirmDialogComponent, { data: { name: 'x' } });
    await new Promise(resolve => setTimeout(resolve, 30));

    click('cancel');
    await result;

    expect(panel()).toBeNull();
  });

  it('should forward config to the modal', async () => {
    void service.open(ConfirmDialogComponent, { data: { name: 'x' }, size: 'xl', showCloseButton: false });
    await new Promise(resolve => setTimeout(resolve, 30));

    const pane = panel()?.closest('.cdk-overlay-pane') as HTMLElement | null;
    expect(pane?.style.maxWidth).toBe('56rem');
    expect(document.querySelector('.cdk-overlay-container tailwind-button')).toBeNull();
  });

  it('should forward maxWidth to the modal', async () => {
    void service.open(ConfirmDialogComponent, { data: { name: 'x' }, size: 'xl', maxWidth: '72rem' });
    await new Promise(resolve => setTimeout(resolve, 30));

    const pane = panel()?.closest('.cdk-overlay-pane') as HTMLElement | null;
    expect(pane?.style.maxWidth).toBe('72rem');
  });
});
