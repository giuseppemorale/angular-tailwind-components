import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TailwindPalette } from '../../models';
import { feedbackSurfaceClasses } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';
import { TailwindButton } from '../button/button.component';

import { TailwindToastConfig } from './interfaces/toast-config.interface';
import { TailwindToastItem } from './interfaces/toast-item.interface';
import { TailwindToastService } from '../../services';
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

  toastClasses(color: TailwindPalette = 'sky'): string {
    return `pointer-events-auto rounded-xl border shadow-lg p-4 flex gap-3 animate-in slide-in-from-right-full duration-300 ${feedbackSurfaceClasses(color)}`;
  }
}
