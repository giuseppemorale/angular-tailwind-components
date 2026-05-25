import { TailwindPalette } from '../../../models';

export interface TailwindMeterSegment {
  value: number;
  label?: string;
  /** Tailwind palette family for this segment */
  color?: TailwindPalette;
}
