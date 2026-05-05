import { TailwindSize } from '../../../models';

export interface TailwindModalConfig<TData = any> {
  /** Size variant */
  size?: TailwindSize;
  /** Show the X close button in header */
  showCloseButton?: boolean;
  /** Click backdrop to close */
  closeOnBackdrop?: boolean;
  /** Press Escape to close */
  closeOnEscape?: boolean;
}
