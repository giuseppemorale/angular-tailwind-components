import { TailwindSize } from '../../../models';

export interface TailwindModalConfig<D = unknown> {
  /** Arbitrary data injected into the modal component via TAILWIND_MODAL_DATA */
  data?: D;
  /** Size variant */
  size?: TailwindSize;
  /** Show the X close button in header */
  showCloseButton?: boolean;
  /** Click backdrop to close */
  closeOnBackdrop?: boolean;
  /** Press Escape to close */
  closeOnEscape?: boolean;
}
