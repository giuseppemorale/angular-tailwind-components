import { Component, input } from '@angular/core';
import { TailwindBreadcrumbItem } from './interfaces/breadcrumb-item.interface';
import { TailwindComponent } from '../tailwind.component';

export type { TailwindBreadcrumbItem };

@Component({
  selector: 'tailwind-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class TailwindBreadcrumb extends TailwindComponent {
  readonly items = input<TailwindBreadcrumbItem[]>([]);
  readonly ariaLabel = input<string>('Breadcrumb');
}
