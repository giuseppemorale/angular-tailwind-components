import { TailwindColor } from '../../../models';

export interface TailwindToastConfig {
  message: string;
  title?: string;
  color?: TailwindColor;
  duration?: number;
  dismissible?: boolean;
}
