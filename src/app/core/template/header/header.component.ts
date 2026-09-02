import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  TailwindBreadcrumbItem,
  TailwindBreadcrumbModule,
  TailwindTitleModule,
  TailwindTitleTag
} from 'angular-tailwind-components';

@Component({
  imports: [NgClass, TailwindBreadcrumbModule, TailwindTitleModule],
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly class = input<string>('');

  readonly items = input.required<TailwindBreadcrumbItem[]>();

  readonly titleTag = input<TailwindTitleTag>('h1');

  readonly description = input<string>();

  readonly page = computed<TailwindBreadcrumbItem>(() => this.items()[this.items().length - 1]);
}
