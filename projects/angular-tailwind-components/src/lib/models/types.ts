/** Common types used across all components */

/** Size variants for components */
export type AtcSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Color variants for buttons and interactive elements */
export type AtcVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';

/** Alert/feedback color variants */
export type AtcSeverity = 'success' | 'warning' | 'danger' | 'info';

/** Position variants for overlays */
export type AtcPosition = 'top' | 'bottom' | 'left' | 'right';

/** Shape variants */
export type AtcShape = 'rounded' | 'pill' | 'square';

/** Common interface for components with label + description */
export interface AtcLabeledComponent {
  label?: string;
  description?: string;
}

/** Option interface for select/radio/checkbox groups */
export interface AtcOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
}
