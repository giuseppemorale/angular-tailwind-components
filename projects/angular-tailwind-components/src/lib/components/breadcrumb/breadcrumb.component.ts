import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TailwindBreadcrumbItem } from './interfaces/breadcrumb-item.interface';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink, TailwindIcon],
  selector: 'tailwind-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindBreadcrumb extends TailwindComponent {
  /** Trail entries; `link` or `href` turns a crumb into a link, `icon` prepends a Heroicon. */
  readonly items = input<TailwindBreadcrumbItem[]>([]);
  /** Character drawn between crumbs; hidden from screen readers. */
  readonly separator = input<string>('>');
  /** Accessible name of the `nav` landmark wrapping the trail. */
  readonly ariaLabel = input<string>('Breadcrumb');
}
