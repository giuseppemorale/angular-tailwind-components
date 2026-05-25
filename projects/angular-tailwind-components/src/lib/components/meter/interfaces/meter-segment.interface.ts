import { TailwindSeverity } from '../../../models';

/** One segment in a meter bar (inspired by PrimeNG MeterGroup). */
export interface TailwindMeterSegment {
  /** Legend label */
  label: string;
  /** Portion relative to `max` (same unit as max, e.g. percent points when max is 100) */
  value: number;
  /** Color variant; defaults to primary */
  variant?: TailwindSeverity | 'primary';
}
