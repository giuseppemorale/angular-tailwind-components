import { Component, inject } from '@angular/core';
import { TailwindToastService } from './toast.service';

@Component({
  selector: 'tailwind-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class TailwindToastContainer {
  toastService = inject(TailwindToastService);
}
