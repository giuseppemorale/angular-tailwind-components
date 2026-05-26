import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TailwindButton,
  TailwindCard,
  TailwindDivider,
  TailwindInput,
  TailwindSpinner,
  TailwindTitle,
  TailwindToggle,
  TailwindEditor
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindCard,
    TailwindTitle,
    TailwindDivider,
    TailwindInput,
    TailwindEditor,
    TailwindToggle,
    TailwindButton,
    TailwindSpinner,
    TranslocoPipe
  ],
  selector: 'app-page-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  readonly breadcrumb = [
    { label: 'Home', link: '/', icon: 'home' },
    { label: 'Profilo', link: '/profile' }
  ];

  readonly saving = signal(false);

  readonly lastSave = signal<Date | undefined>(undefined);

  readonly saveString = computed(() => (this.lastSave() ? this.lastSave()?.toLocaleString() : '—'));

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    bio: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    notify: new FormControl<boolean>(false, { nonNullable: true })
  });

  simulateSave(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.lastSave.set(new Date());
    }, 1200);
  }
}
