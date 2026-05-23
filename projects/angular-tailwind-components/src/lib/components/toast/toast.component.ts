import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
}
