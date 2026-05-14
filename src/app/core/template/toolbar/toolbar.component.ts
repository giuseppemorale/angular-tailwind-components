import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  readonly menu: TailwindMenuItem[] = [
    { label: this.translocoService.translate('TOOLBAR.HOME'), value: 'home' },
    { label: this.translocoService.translate('TOOLBAR.PROFILE'), value: 'profile' },
    { label: this.translocoService.translate('TOOLBAR.SETTINGS'), value: 'settings' },
    { label: this.translocoService.translate('TOOLBAR.DOCS'), value: 'docs' }
  ];
}
