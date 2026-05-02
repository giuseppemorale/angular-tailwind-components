import { Injectable, signal } from '@angular/core';
import { TailwindModalConfig } from './interfaces/modal-config.interface';
import { TailwindModalState } from './interfaces/modal-state.interface';

export type { TailwindModalConfig };

@Injectable({ providedIn: 'root' })
export class TailwindModalService {
  /** @internal current modal state, consumed by TailwindModalContainer */
  readonly _state = signal<TailwindModalState | null>(null);

  /**
   * Open a modal and return a Promise that resolves when it closes.
   * Resolves with `result` if closed via `close(result)` or confirm button.
   * Resolves with `undefined` if dismissed (backdrop / escape / X button).
   */
  open<R = any>(config: TailwindModalConfig): Promise<R | undefined> {
    return new Promise<R | undefined>(resolve => {
      this._state.set({ config, resolve, isVisible: false });
      // Animate in on next frame
      requestAnimationFrame(() => {
        this._state.update(s => (s ? { ...s, isVisible: true } : s));
      });
    });
  }

  /**
   * Shorthand for a simple confirm dialog.
   */
  async confirm(options: {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }): Promise<boolean> {
    const r = await this.open<boolean>({
      ...options,
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      showCloseButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true
    });
    return r === true;
  }

  /** Close with a result value */
  close<R = any>(result?: R): void {
    this._animateOut(() => {
      const state = this._state();
      if (state) {
        state.resolve(result);
        this._state.set(null);
      }
    });
  }

  /** Dismiss without a result */
  dismiss(): void {
    this.close(undefined);
  }

  private _animateOut(cb: () => void): void {
    this._state.update(s => (s ? { ...s, isVisible: false } : s));
    setTimeout(cb, 200);
  }
}
