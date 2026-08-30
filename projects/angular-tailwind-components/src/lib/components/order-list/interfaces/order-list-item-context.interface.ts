/** Context passed to the `#item` ng-template. */
export interface TailwindOrderListItemContext<T = unknown> {
  $implicit: T;
  item: T;
  /** Position in the rendered list, which is the filtered view when a filter is active. */
  index: number;
  selected: boolean;
}
