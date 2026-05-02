import { TailwindModalConfig } from './modal-config.interface';

export interface TailwindModalState<R = any> {
  config: TailwindModalConfig;
  resolve: (result: R | undefined) => void;
  isVisible: boolean;
}
