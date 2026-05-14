import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TailwindButton, TailwindMenuItem, TailwindToolbar } from 'angular-tailwind-components';

@Component({
  imports: [TailwindToolbar, TailwindButton, TranslocoPipe],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly router = inject(Router);

  readonly menu: TailwindMenuItem[] = [
    { label: this.translocoService.translate('TOOLBAR.HOME'), value: 'home' },
    { label: this.translocoService.translate('TOOLBAR.PROFILE'), value: 'profile' },
    { label: this.translocoService.translate('TOOLBAR.SETTINGS'), value: 'settings' },
    { label: this.translocoService.translate('TOOLBAR.DOCS'), value: 'docs' }
  ];

  onMenuSelect(item: TailwindMenuItem): void {
    const path = item.value?.trim();
    if (path) {
      void this.router.navigateByUrl(`/${path}`);
    }
  }
}
