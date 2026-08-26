import type { TailwindTreeNode } from './tree-node.interface';

/** One node flattened for rendering, carrying the depth and state a row needs. */
export interface FlatNode {
  node: TailwindTreeNode;
  /** Stable path from the root, used as identity and as the expansion key. */
  key: string;
  level: number;
  expandable: boolean;
  expanded: boolean;
  selected: boolean;
}
