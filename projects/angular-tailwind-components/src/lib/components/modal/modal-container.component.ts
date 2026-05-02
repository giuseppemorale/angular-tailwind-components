import { Component, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { AtcModalService } from './modal.service';

@Component({
  selector: 'atc-modal-container',
  templateUrl: './modal-container.component.html',
  styleUrl: './modal-container.component.scss',
  imports: [NgComponentOutlet],
})
export class AtcModalContainer {
  readonly modalService = inject(AtcModalService);
}
