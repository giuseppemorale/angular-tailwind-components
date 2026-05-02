import { Component, inject } from '@angular/core';
import { TailwindToastService } from './toast.service';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class TailwindToastContainer extends TailwindComponent {
  toastService = inject(TailwindToastService);
}
