import { Component, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TailwindModalService } from './modal.service';

@Component({
  selector: 'tailwind-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
  imports: [NgComponentOutlet]
})
export class TailwindModalContainer {
  readonly modalService = inject(TailwindModalService);
}
