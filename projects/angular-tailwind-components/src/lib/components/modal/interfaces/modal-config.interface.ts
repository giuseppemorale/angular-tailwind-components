import { Type } from '@angular/core';
import { TailwindSize } from '../../../models';

export interface TailwindModalConfig<TData = any> {
  /** Modal title */
  title?: string;
  /** Size variant */
  size?: TailwindSize;
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
