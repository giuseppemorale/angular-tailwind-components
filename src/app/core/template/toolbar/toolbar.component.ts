import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TailwindButton, TailwindMenuItem, TailwindToolbar } from 'angular-tailwind-components';

@Component({
  imports: [TailwindToolbar, TailwindButton],
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  readonly menu: TailwindMenuItem[] = [
    { label: 'Home', value: 'home' },
    { label: 'Profile', value: 'profile' },
    { label: 'Settings', value: 'settings' },
    { label: 'Docs', value: 'docs' }
  ];
}
