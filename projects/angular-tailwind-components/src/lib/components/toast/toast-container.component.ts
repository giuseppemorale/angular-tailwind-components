import { Component, inject } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

import { TailwindToastConfig } from './interfaces/toast-config.interface';
import { TailwindToastItem } from './interfaces/toast-item.interface';
import { TailwindToastService } from '../../services';
export type { TailwindToastConfig, TailwindToastItem };

@Component({
  selector: 'tailwind-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class TailwindToastContainer extends TailwindComponent {
  toastService = inject(TailwindToastService);
}
