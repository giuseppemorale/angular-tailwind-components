/** Common types used across all components */

/** Size variants for components */
export type TailwindSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Color variants for buttons and interactive elements */
export type TailwindColor = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info';

/** Button kinds */
export type TailwindButtonKind = 'solid' | 'outlined' | 'text';

/** Alert/feedback color variants */
export type TailwindSeverity = 'success' | 'warning' | 'danger' | 'info';

/** Position variants for overlays */
export type TailwindPosition = 'top' | 'bottom' | 'left' | 'right';

/** Shape variants */
export type TailwindShape = 'rounded' | 'pill' | 'square';

/** Common interface for components with label + description */
export interface TailwindLabeledComponent {
  label?: string;
  description?: string;
}

/** Option interface for select/radio/checkbox groups */
export interface TailwindOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  description?: string;
}
