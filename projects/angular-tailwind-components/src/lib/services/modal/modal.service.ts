import { inject, Injectable, signal, Type } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { TailwindModalConfig } from '../../components/modal/interfaces/modal-config.interface';
import { TailwindModalState } from '../../components/modal/interfaces/modal-state.interface';

export type { TailwindModalConfig };

@Injectable({ providedIn: 'root' })
export class TailwindModalService {
  private readonly overlay = inject(Overlay);

  /** @internal current modal state, consumed by TailwindModalContainer */
  readonly _state = signal<TailwindModalState | null>(null);

  /**
   * Open a modal and return a Promise that resolves when it closes.
   * Resolves with `result` if closed via `close(result)` or confirm button.
   * Resolves with `undefined` if dismissed (backdrop / escape / X button).
   */
  open<R = any>(component: Type<unknown>, config: TailwindModalConfig): Promise<R | undefined> {
    return new Promise<R | undefined>(resolve => {
      this._state.set({ config, resolve, isVisible: false });
      // Animate in on next frame
      requestAnimationFrame(() => {
        this._state.update(s => (s ? { ...s, isVisible: true } : s));
      });
    });
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
