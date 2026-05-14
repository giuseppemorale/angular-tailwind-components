import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import {
  TailwindButton,
  TailwindCard,
  TailwindMessage,
  TailwindPagination,
  TailwindProgressBar,
  TailwindTitle
} from 'angular-tailwind-components';

@Component({
  selector: 'app-page-docs',
  imports: [TailwindTitle, TailwindCard, TailwindMessage, TailwindProgressBar, TailwindPagination, TailwindButton],
  templateUrl: './docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsComponent {
  readonly docPage = model(1);
  readonly progressDemo = model(38);

  bumpProgress(): void {
    const next = Math.min(100, this.progressDemo() + 12);
    this.progressDemo.set(next);
  }
}
