import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TailwindColor } from '../../models';
import { TailwindToastService } from '../../services';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindToastConfig } from './interfaces/toast-config.interface';
import { TailwindToastItem } from './interfaces/toast-item.interface';

export type { TailwindToastConfig, TailwindToastItem };

@Component({
  imports: [TailwindButton],
  selector: 'tailwind-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindToast extends TailwindComponent {
  readonly toastService = inject(TailwindToastService);

  surfaceClass(color: TailwindColor | undefined): string {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-50 border-primary-200',
      secondary: 'bg-neutral-50 border-neutral-200',
      success: 'bg-success-50 border-success-200',
      warning: 'bg-warning-50 border-warning-200',
      danger: 'bg-danger-50 border-danger-200',
      info: 'bg-info-50 border-info-200',
      transparent: 'bg-white border-neutral-200'
    };
    return colorMap[color ?? 'info'];
  }
}
