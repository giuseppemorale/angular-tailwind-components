import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import {
  TailwindCard,
  TailwindDivider,
  TailwindSelect,
  TailwindTab,
  TailwindTabGroup,
  TailwindTitle,
  TailwindToggle,
  type TailwindOption
} from 'angular-tailwind-components';

@Component({
  selector: 'app-page-settings',
  imports: [TailwindTitle, TailwindCard, TailwindTabGroup, TailwindTab, TailwindToggle, TailwindDivider, TailwindSelect],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  readonly densityOptions: TailwindOption<string>[] = [
    { value: 'comfortable', label: 'Comoda' },
    { value: 'compact', label: 'Compatta' }
  ];

  readonly theme = model<string | null>('comfortable');
  readonly tabIndex = model(0);
}
