import { TailwindSeverity } from '../../../models';

export interface TailwindToastConfig {
  message: string;
  title?: string;
  severity?: TailwindSeverity;
  duration?: number;
  dismissible?: boolean;
}
