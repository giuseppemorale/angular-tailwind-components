import { Component, input } from '@angular/core';
import { TailwindBreadcrumbItem } from './interfaces/breadcrumb-item.interface';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';
import { RouterLink } from '@angular/router';

export type { TailwindBreadcrumbItem };

@Component({
  imports: [RouterLink, TailwindIcon],
  selector: 'tailwind-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class TailwindBreadcrumb extends TailwindComponent {
  readonly items = input<TailwindBreadcrumbItem[]>([]);
  readonly ariaLabel = input<string>('Breadcrumb');
}
