import { TailwindSize } from '../../../models';

export interface TailwindModalConfig<D = unknown> {
  /** Arbitrary data injected into the modal component via TAILWIND_MODAL_DATA */
  data?: D;
  /** Size variant */
  size?: TailwindSize;
  /** Explicit panel width (any CSS length); overrides `size` for content wider than `xl`. */
  maxWidth?: string;
  /** Show the X close button in header */
  showCloseButton?: boolean;
  /** Click backdrop to close */
  closeOnBackdrop?: boolean;
  /** Press Escape to close */
  closeOnEscape?: boolean;
}
