import { TailwindColor, TailwindHeroicon } from '../../../models';

export interface TailwindToastConfig {
  title: string;
  message: string;
  icon?: TailwindHeroicon;
  color?: TailwindColor;
  duration?: number;
  dismissible?: boolean;
}
