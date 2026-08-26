import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindAvatar,
  TailwindButton,
  TailwindCard,
  TailwindDivider,
  TailwindEditor,
  TailwindInput,
  TailwindSpinner,
  TailwindTextarea,
  TailwindTitle,
  TailwindToastService,
  TailwindToggle,
  TailwindUpload
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindCard,
    TailwindTitle,
    TailwindAvatar,
    TailwindDivider,
    TailwindInput,
    TailwindTextarea,
    TailwindEditor,
    TailwindUpload,
    TailwindToggle,
    TailwindButton,
    TailwindSpinner,
    TranslocoPipe
  ],
  selector: 'app-page-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private readonly toastService = inject(TailwindToastService);
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' },
    { label: this.transloco.translate('PROFILE.PAGE_TITLE'), link: '/profile' }
  ];

  readonly saving = signal(false);

  readonly lastSave = signal<Date | undefined>(undefined);

  readonly saveString = computed(() => (this.lastSave() ? this.lastSave()?.toLocaleString() : '—'));

  readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    notes: new FormControl<string>('', { nonNullable: true }),
    bio: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    avatar: new FormControl<string | null>(null),
    notify: new FormControl<boolean>(false, { nonNullable: true })
  });

  /** Nome digitato nel form: alimenta le iniziali di `tailwind-avatar`. */
  private readonly nameValue = toSignal(this.form.controls.name.valueChanges, {
    initialValue: this.form.controls.name.value
  });

  readonly avatarName = computed(
    () => this.nameValue().trim() || this.transloco.translate('PROFILE.AVATAR_FALLBACK_NAME')
  );

  simulateSave(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.lastSave.set(new Date());
      this.toastService.success(
        this.transloco.translate('PROFILE.TOAST_SAVE_TITLE'),
        this.transloco.translate('PROFILE.TOAST_SAVE_BODY'),
        'check-circle'
      );
    }, 1200);
  }
}
