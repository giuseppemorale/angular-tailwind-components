import { TailwindPalette } from '../../../models';

export interface TailwindToastConfig {
  message: string;
  title?: string;
  color?: TailwindPalette;
  duration?: number;
  dismissible?: boolean;
}
