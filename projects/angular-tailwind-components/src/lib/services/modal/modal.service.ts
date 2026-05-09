import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  Type
} from '@angular/core';
import { TailwindModal } from '../../components/modal/modal.component';
import { TailwindModalConfig } from '../../components/modal/interfaces/modal-config.interface';
import { TailwindModalRef } from '../../ref/modal/modal.ref';
import { TAILWIND_MODAL_DATA } from '../../tokens/tokens';

export type { TailwindModalConfig };

@Injectable({ providedIn: 'root' })
export class TailwindModalService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);

  /**
   * Open a modal programmatically.
   *
   * The `component` is instantiated and its slot elements are projected into
   * TailwindModal's ng-content slots (attribute selectors on direct children):
   *  - `[tailwind-modal-title]`   → header title area
   *  - `[tailwind-modal-content]` → body area
   *  - `[tailwind-modal-footer]`  → footer area
   *
   * The component can inject `TailwindModalRef<R>` to close with a typed result
   * and `TAILWIND_MODAL_DATA` to receive the `config.data` payload.
   *
   * @returns Promise that resolves with `R` on `close(result)` or `undefined` on dismiss.
   */
  open<R = any, D = any>(component: Type<unknown>, config: TailwindModalConfig<D> = {}): Promise<R | undefined> {
    return new Promise<R | undefined>(resolve => {
      const modalRef = new TailwindModalRef<R>();

      const injector = Injector.create({
        providers: [
          { provide: TailwindModalRef, useValue: modalRef },
          { provide: TAILWIND_MODAL_DATA, useValue: config.data ?? null }
        ],
        parent: this.environmentInjector
      });

      // ── Step 1: create and render the user component ─────────────────────
      const userComp = createComponent(component, {
        environmentInjector: this.environmentInjector,
        elementInjector: injector
      });
      this.appRef.attachView(userComp.hostView);
      userComp.changeDetectorRef.detectChanges();

      // ── Step 2: extract slot elements from the rendered host ──────────────
      const host = userComp.location.nativeElement as HTMLElement;
      const nodes = (sel: string) => Array.from(host.querySelectorAll(`:scope > ${sel}`));

      // ── Step 3: create TailwindModal projecting the slot nodes ────────────
      //   projectableNodes[0] → <ng-content />                     (title / catch-all)
      //   projectableNodes[1] → <ng-content select="[tailwind-modal-content]" />
      //   projectableNodes[2] → <ng-content select="[tailwind-modal-footer]" />
      const modalComp = createComponent(TailwindModal, {
        environmentInjector: this.environmentInjector,
        elementInjector: injector,
        projectableNodes: [
          nodes('[tailwind-modal-title]'),
          nodes('[tailwind-modal-content]'),
          nodes('[tailwind-modal-footer]')
        ]
      });

      modalComp.setInput('size', config.size ?? 'md');
      modalComp.setInput('showCloseButton', config.showCloseButton ?? true);
      modalComp.setInput('closeOnBackdrop', config.closeOnBackdrop ?? true);
      modalComp.setInput('closeOnEscape', config.closeOnEscape ?? true);

      this.appRef.attachView(modalComp.hostView);
      document.body.appendChild(modalComp.location.nativeElement);

      // ── Step 4: wire close ────────────────────────────────────────────────
      modalRef._init(() => modalComp.instance.close());

      const sub = modalComp.instance.onClose.subscribe(() => {
        sub.unsubscribe();
        resolve(modalRef._getResult());
        modalComp.location.nativeElement.remove();
        this.appRef.detachView(modalComp.hostView);
        this.appRef.detachView(userComp.hostView);
        modalComp.destroy();
        userComp.destroy();
      });

      modalComp.instance.open();
    });
  }
}
