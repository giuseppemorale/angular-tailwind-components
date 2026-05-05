import { TailwindModalConfig } from './modal-config.interface';

export interface TailwindModalState<R = any> {
  isVisible: boolean;
  config: TailwindModalConfig;
  resolve: (result: R | undefined) => void;
}
