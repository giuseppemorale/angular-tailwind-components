import type { TailwindSolarIcon } from '../../../models';

export interface TailwindBreadcrumbItem {
  label: string;
  /** URL del crumb intermedio (se assente si può usare `href`) */
  link?: string;
  href?: string;
  /** Icona Solar Line Duotone opzionale prima del `label` */
  icon?: TailwindSolarIcon;
}
