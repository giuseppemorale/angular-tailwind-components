import { Component, inject, model, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindButton,
  TailwindCard,
  TailwindEditor,
  TailwindMessage,
  TailwindMeter,
  TailwindModalService,
  TailwindPagination,
  TailwindProgressBar,
  TailwindSkeleton,
  TailwindTitle,
  type TailwindMeterSegment
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import { ExportDocsModalComponent } from '../settings/components/export-docs-modal/export-docs-modal.component';

@Component({
  imports: [
    HeaderComponent,
    TailwindTitle,
    TailwindCard,
    TailwindMessage,
    TailwindProgressBar,
    TailwindButton,
    TailwindAccordion,
    TailwindAccordionItem,
    TailwindPagination,
    TailwindSkeleton,
    TailwindMeter,
    TailwindEditor,
    TranslocoPipe
  ],
  selector: 'app-page-docs',
  templateUrl: './docs.component.html'
})
export class DocsComponent {
  private readonly modalService = inject(TailwindModalService);

  readonly breadcrumb = [
    { label: 'Home', link: '/', icon: 'home' },
    { label: 'Documentazione', link: '/docs' }
  ];

  readonly docPage = model(1);
  readonly docPageSize = model(5);
  readonly progressDemo = model(38);
  readonly showSkeletonPreview = signal(false);
  readonly editorDemo = model('<p>Editor ricco con toolbar, link e immagini.</p>');
  readonly toolbarBoldPressed = signal(false);

  readonly docTotalItems = 23;

  readonly meterSegments: TailwindMeterSegment[] = [
    { label: 'Guide', value: 40, color: 'primary' },
    { label: 'API', value: 30, color: 'info' },
    { label: 'Esempi', value: 20, color: 'warning' },
    { label: 'Altro', value: 10, color: 'secondary' }
  ];

  bumpProgress(): void {
    const next = Math.min(100, this.progressDemo() + 12);
    this.progressDemo.set(next);
  }

  toggleSkeletonPreview(): void {
    this.showSkeletonPreview.update(v => !v);
  }

  toggleToolbarBold(): void {
    this.toolbarBoldPressed.update(v => !v);
  }

  openExportModal(): void {
    void this.modalService.open(ExportDocsModalComponent, { size: 'md' });
  }
}
