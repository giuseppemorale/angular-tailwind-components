import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  TailwindBreadcrumb,
  TailwindBreadcrumbItem,
  TailwindTitle,
  TailwindTitleTag
} from 'angular-tailwind-components';

@Component({
  imports: [TailwindBreadcrumb, TailwindTitle],
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly items = input.required<TailwindBreadcrumbItem[]>();

  readonly titleTag = input<TailwindTitleTag>('h1');

  readonly description = input<string>();

  readonly page = computed<TailwindBreadcrumbItem>(() => this.items()[this.items().length - 1]);
}
