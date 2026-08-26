import type { TailwindOption } from '../../../models';

/** Context passed to the `#item` ng-template. */
export interface TailwindAutocompleteItemContext<T = unknown> {
  $implicit: TailwindOption<T>;
  option: TailwindOption<T>;
  index: number;
  selected: boolean;
  active: boolean;
}
