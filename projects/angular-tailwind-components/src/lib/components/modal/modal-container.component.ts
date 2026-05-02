import { Component, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TailwindModalService } from './modal.service';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
  imports: [NgComponentOutlet]
})
export class TailwindModalContainer extends TailwindComponent {
  readonly modalService = inject(TailwindModalService);
}
