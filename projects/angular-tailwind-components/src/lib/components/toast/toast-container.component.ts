import { Component, inject } from '@angular/core';
import { AtcToastService } from './toast.service';

@Component({
  selector: 'atc-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class AtcToastContainer {
  toastService = inject(AtcToastService);
}
