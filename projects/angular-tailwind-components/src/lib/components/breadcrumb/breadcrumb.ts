import { Component, input } from '@angular/core';

export interface AtcBreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'atc-breadcrumb',
  standalone: true,
  template: `
    <nav [attr.aria-label]="ariaLabel()" class="flex">
      <ol class="inline-flex items-center gap-1.5 text-sm">
        @for (item of items(); track item.label; let last = $last; let first = $first) {
          <li class="inline-flex items-center">
            @if (!first) {
              <span class="mx-1.5 text-surface-400" aria-hidden="true">
                <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </span>
            }
            @if (item.href && !last) {
              <a [href]="item.href" class="text-surface-500 hover:text-primary-600 transition-colors font-medium">{{ item.label }}</a>
            } @else {
              <span class="font-medium" [class.text-surface-900]="last" [class.text-surface-500]="!last" [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `:host { display: block; }`,
})
export class AtcBreadcrumb {
  items = input<AtcBreadcrumbItem[]>([]);
  ariaLabel = input<string>('Breadcrumb');
}
