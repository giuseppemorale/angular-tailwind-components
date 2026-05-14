import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindBreadcrumb, TailwindBreadcrumbItem, TailwindTitle } from 'angular-tailwind-components';

@Component({
  imports: [TailwindBreadcrumb, TailwindTitle],
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly page = input.required<string>();

  readonly items = computed<TailwindBreadcrumbItem[]>(() => [
    { label: 'Home', link: '/' },
    { label: this.page(), link: `/${this.page()}` }
  ]);
}
