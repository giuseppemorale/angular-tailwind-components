import type { TailwindHeroicon } from '../../../models';

/** One node of a `tailwind-tree`. */
export interface TailwindTreeNode {
  /** Identity among its siblings; the tree joins it with the ancestors' keys to form a stable path. */
  key: string;
  /** Text shown on the row. */
  label: string;
  /** Optional icon before the label. */
  icon?: TailwindHeroicon;
  /** Nested nodes; a node with children is expandable. */
  children?: TailwindTreeNode[];
  /** Blocks selection and expansion of this row. */
  disabled?: boolean;
  /** Anything the consumer needs to carry along, returned in `nodeSelect`. */
  data?: unknown;
}
