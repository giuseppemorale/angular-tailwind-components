import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  TailwindButton,
  TailwindCard,
  TailwindDivider,
  TailwindInput,
  TailwindSpinner,
  TailwindTextarea,
  TailwindTitle,
  TailwindToggle
} from 'angular-tailwind-components';

@Component({
  selector: 'app-page-profile',
  imports: [TailwindTitle, TailwindCard, TailwindDivider, TailwindInput, TailwindTextarea, TailwindToggle, TailwindButton, TailwindSpinner],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  readonly saving = signal(false);

  simulateSave(): void {
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1200);
  }
}
