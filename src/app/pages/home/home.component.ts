import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCard,
  TailwindDivider,
  TailwindTitle,
  type TailwindBreadcrumbItem
} from 'angular-tailwind-components';

@Component({
  selector: 'app-page-home',
  imports: [
    TailwindTitle,
    TailwindBreadcrumb,
    TailwindCard,
    TailwindAlert,
    TailwindBadge,
    TailwindDivider,
    TailwindButton
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly breadcrumb: TailwindBreadcrumbItem[] = [
    { label: 'Documentazione', link: '/docs', icon: 'document-text' },
    { label: 'Home', icon: 'home' }
  ];
}
