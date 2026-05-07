import { Component, inject } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

import { TailwindToastConfig } from './interfaces/toast-config.interface';
import { TailwindToastItem } from './interfaces/toast-item.interface';
import { TailwindToastService } from '../../services';
export type { TailwindToastConfig, TailwindToastItem };

@Component({
  selector: 'tailwind-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class TailwindToast extends TailwindComponent {
  readonly toastService = inject(TailwindToastService);
}
