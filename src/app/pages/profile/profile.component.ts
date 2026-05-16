import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
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
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindCard,
    TailwindTitle,
    TailwindDivider,
    TailwindInput,
    TailwindTextarea,
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

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    bio: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    notify: new FormControl<boolean>(false, { nonNullable: true })
  });

  simulateSave(): void {
    console.log(this.form.value);
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 1200);
  }
}
