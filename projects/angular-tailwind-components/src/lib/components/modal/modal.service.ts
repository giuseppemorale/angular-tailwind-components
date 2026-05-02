import { Injectable, signal, Type } from '@angular/core';
import { AtcSize } from '../../models';

export interface AtcModalConfig<TData = any> {
  /** Modal title */
  title?: string;
  /** Size variant */
  size?: AtcSize;
  /** Simple text message shown in body */
  message?: string;
  /** Dynamic component to render as body */
  component?: Type<any>;
  /** Inputs to pass to the dynamic component */
  inputs?: Record<string, any>;
  /** Label for the primary (confirm) button */
  confirmLabel?: string;
  /** Label for the secondary (cancel) button */
  cancelLabel?: string;
  /** Show the X close button in header */
  showCloseButton?: boolean;
  /** Click backdrop to close */
  closeOnBackdrop?: boolean;
  /** Press Escape to close */
  closeOnEscape?: boolean;
}

interface AtcModalState<R = any> {
  config: AtcModalConfig;
  resolve: (result: R | undefined) => void;
  isVisible: boolean;
}

@Injectable({ providedIn: 'root' })
export class AtcModalService {
  /** @internal current modal state, consumed by AtcModalContainer */
  readonly _state = signal<AtcModalState | null>(null);

  /**
   * Open a modal and return a Promise that resolves when it closes.
   * Resolves with `result` if closed via `close(result)` or confirm button.
   * Resolves with `undefined` if dismissed (backdrop / escape / X button).
   */
  open<R = any>(config: AtcModalConfig): Promise<R | undefined> {
    return new Promise<R | undefined>((resolve) => {
      this._state.set({ config, resolve, isVisible: false });
      // Animate in on next frame
      requestAnimationFrame(() => {
        this._state.update(s => s ? { ...s, isVisible: true } : s);
      });
    });
  }

  /**
   * Shorthand for a simple confirm dialog.
   */
  confirm(options: {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }): Promise<boolean> {
    return this.open<boolean>({
      ...options,
      confirmLabel: options.confirmLabel ?? 'Confirm',
      cancelLabel: options.cancelLabel ?? 'Cancel',
      showCloseButton: true,
      closeOnBackdrop: true,
      closeOnEscape: true,
    }).then(r => r === true);
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
    this._state.update(s => s ? { ...s, isVisible: false } : s);
    setTimeout(cb, 200);
  }
}
