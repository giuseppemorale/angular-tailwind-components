import { Component, input } from '@angular/core';

export interface AtcBreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'atc-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class AtcBreadcrumb {
  items = input<AtcBreadcrumbItem[]>([]);
  ariaLabel = input<string>('Breadcrumb');
}
