import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TailwindButton,
  TailwindCard,
  TailwindMessage,
  TailwindProgressBar,
  TailwindTitle
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    HeaderComponent,
    TailwindTitle,
    TailwindCard,
    TailwindMessage,
    TailwindProgressBar,
    TailwindButton,
    TranslocoPipe
  ],
  selector: 'app-page-docs',
  templateUrl: './docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsComponent {
  readonly breadcrumb = [
    { label: 'Home', link: '/', icon: 'home' },
    { label: 'Documentazione', link: '/docs' }
  ];

  readonly docPage = model(1);
  readonly progressDemo = model(38);

  bumpProgress(): void {
    const next = Math.min(100, this.progressDemo() + 12);
    this.progressDemo.set(next);
  }
}
