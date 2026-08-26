import { Component, computed, inject, model, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindButton,
  TailwindCard,
  TailwindEditor,
  TailwindIcon,
  TailwindKbd,
  TailwindMenu,
  TailwindMessage,
  TailwindMeter,
  TailwindModalService,
  TailwindPagination,
  TailwindPopover,
  TailwindProgressBar,
  TailwindSkeleton,
  TailwindTimeline,
  TailwindTimelineItem,
  TailwindTitle,
  TailwindToastService,
  TailwindTree,
  type TailwindMenuItem,
  type TailwindMeterSegment,
  type TailwindTreeNode
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import { ExportDocsModalComponent } from './components/export-docs-modal/export-docs-modal.component';

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
    TailwindTree,
    TailwindKbd,
    TailwindIcon,
    TailwindPopover,
    TailwindMenu,
    TailwindTimeline,
    TailwindTimelineItem,
    TranslocoPipe
  ],
  selector: 'app-page-docs',
  templateUrl: './docs.component.html'
})
export class DocsComponent {
  private readonly modalService = inject(TailwindModalService);
  private readonly toastService = inject(TailwindToastService);
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' },
    { label: this.transloco.translate('DOCS.PAGE_TITLE'), link: '/docs' }
  ];

  readonly docPage = model(1);
  readonly docPageSize = model(5);
  readonly progressDemo = model(38);
  readonly showSkeletonPreview = signal(false);
  readonly editorDemo = model(this.transloco.translate('DOCS.EDITOR_DEMO_CONTENT'));
  readonly toolbarBoldPressed = signal(false);

  readonly docTotalItems = 23;

  readonly meterSegments: TailwindMeterSegment[] = [
    { label: this.transloco.translate('DOCS.METER_SEG_GUIDES'), value: 40, color: 'primary' },
    { label: this.transloco.translate('DOCS.METER_SEG_API'), value: 30, color: 'info' },
    { label: this.transloco.translate('DOCS.METER_SEG_EXAMPLES'), value: 20, color: 'warning' },
    { label: this.transloco.translate('DOCS.METER_SEG_OTHER'), value: 10, color: 'secondary' }
  ];

  /** Indice della documentazione per `tailwind-tree`. */
  readonly docTree: TailwindTreeNode[] = [
    {
      key: 'guides',
      label: this.transloco.translate('DOCS.TREE_NODE_GUIDES'),
      icon: 'book-open',
      children: [
        { key: 'guides/install', label: this.transloco.translate('DOCS.TREE_NODE_INSTALL'), icon: 'document-text' },
        { key: 'guides/theming', label: this.transloco.translate('DOCS.TREE_NODE_THEMING'), icon: 'document-text' },
        { key: 'guides/i18n', label: this.transloco.translate('DOCS.TREE_NODE_I18N'), icon: 'document-text' }
      ]
    },
    {
      key: 'components',
      label: this.transloco.translate('DOCS.TREE_NODE_COMPONENTS'),
      icon: 'squares-2x2',
      children: [
        { key: 'components/forms', label: this.transloco.translate('DOCS.TREE_NODE_FORMS'), icon: 'document-text' },
        {
          key: 'components/overlays',
          label: this.transloco.translate('DOCS.TREE_NODE_OVERLAYS'),
          icon: 'document-text'
        },
        { key: 'components/display', label: this.transloco.translate('DOCS.TREE_NODE_DISPLAY'), icon: 'document-text' }
      ]
    },
    { key: 'api', label: this.transloco.translate('DOCS.TREE_NODE_API'), icon: 'code-bracket' },
    { key: 'changelog', label: this.transloco.translate('DOCS.TREE_NODE_CHANGELOG'), icon: 'clock' }
  ];

  readonly treeExpandedKeys = signal(new Set(['guides']));
  readonly selectedDocLabel = signal<string | null>(null);

  /** Azioni rapide di `tailwind-menu`, aperte dal pulsante "Azioni". */
  readonly actionItems: TailwindMenuItem[] = [
    { label: this.transloco.translate('DOCS.MENU_EXPORT_PDF'), value: 'pdf', icon: 'document-arrow-down' },
    { label: this.transloco.translate('DOCS.MENU_EXPORT_MD'), value: 'markdown', icon: 'document-text' },
    { divider: true },
    { label: this.transloco.translate('DOCS.MENU_PRINT'), value: 'print', icon: 'printer' },
    { label: this.transloco.translate('DOCS.MENU_SHARE'), value: 'share', icon: 'link' }
  ];

  readonly selectedDocMessage = computed(() => {
    const label = this.selectedDocLabel();
    return label
      ? this.transloco.translate('DOCS.TREE_SELECTED', { label })
      : this.transloco.translate('DOCS.TREE_NONE_SELECTED');
  });

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

  onDocSelect(node: TailwindTreeNode): void {
    this.selectedDocLabel.set(node.label);
  }

  onActionSelect(item: TailwindMenuItem): void {
    this.toastService.info(
      this.transloco.translate('DOCS.TOAST_ACTION_TITLE'),
      this.transloco.translate('DOCS.TOAST_ACTION_BODY', { action: item.label ?? '' }),
      'information-circle'
    );
  }

  async openExportModal(): Promise<void> {
    const exported = await this.modalService.open<boolean>(ExportDocsModalComponent, { size: 'md' });
    if (exported) {
      this.toastService.success(
        this.transloco.translate('DOCS.TOAST_EXPORT_TITLE'),
        this.transloco.translate('DOCS.TOAST_EXPORT_BODY'),
        'check-circle'
      );
    }
  }
}
