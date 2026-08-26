import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindDrawer,
  TailwindInput,
  TailwindInputOtp,
  TailwindInputPassword,
  TailwindTitle,
  TailwindToastService
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import { ErrorPipe } from '../../core/pipe/error.pipe';

@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    TailwindCard,
    TailwindTitle,
    TailwindInput,
    TailwindInputPassword,
    TailwindInputOtp,
    TailwindCheckbox,
    TailwindButton,
    TailwindDrawer,
    TranslocoPipe,
    ErrorPipe
  ],
  selector: 'app-page-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly toastService = inject(TailwindToastService);
  private readonly transloco = inject(TranslocoService);

  readonly breadcrumb = [
    { label: this.transloco.translate('HOME.BREADCRUMB'), link: '/', icon: 'home' },
    { label: this.transloco.translate('LOGIN.PAGE_TITLE'), link: '/login' }
  ];

  readonly submitting = signal(false);
  readonly useOtp = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
    otp: new FormControl('', { nonNullable: true }),
    remember: new FormControl(false, { nonNullable: true })
  });

  toggleOtpMode(): void {
    this.useOtp.update(v => !v);
    this.form.controls.password.reset();
    this.form.controls.otp.reset();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.useOtp()) {
      if (!this.form.controls.email.valid || this.form.controls.otp.value.length < 6) {
        return;
      }
    } else if (!this.form.valid) {
      return;
    }

    this.submitting.set(true);
    const payload = this.useOtp()
      ? { email: this.form.controls.email.value, otp: this.form.controls.otp.value }
      : this.form.getRawValue();
    console.log('[login demo]', payload);

    setTimeout(() => {
      this.submitting.set(false);
      this.toastService.success(
        this.transloco.translate('LOGIN.TOAST_LOGIN_TITLE'),
        this.transloco.translate('LOGIN.TOAST_LOGIN_BODY'),
        'check-circle'
      );
      void this.router.navigateByUrl('/home');
    }, 800);
  }
}
