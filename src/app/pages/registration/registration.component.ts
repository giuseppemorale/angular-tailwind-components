import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindInput,
  TailwindInputPassword,
  TailwindOption,
  TailwindSelect,
  TailwindStep,
  TailwindStepper,
  TailwindTimePicker,
  TailwindTitle
} from 'angular-tailwind-components';
import { HeaderComponent } from '../../core/template/header/header.component';
import {
  RegistrationAccountForm,
  RegistrationGender,
  RegistrationGeneralForm,
  RegistrationReviewForm
} from './registration-forms.interface';
import { ErrorPipe } from '../../core/pipe/error.pipe';

@Component({
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    TailwindCard,
    TailwindTitle,
    TailwindStepper,
    TailwindStep,
    TailwindInput,
    TailwindInputPassword,
    TailwindSelect,
    TailwindDatePicker,
    TailwindTimePicker,
    TailwindDateTimePicker,
    TailwindCheckbox,
    TailwindButton,
    TranslocoPipe,
    ErrorPipe,
    DatePipe
  ],
  selector: 'app-page-registration',
  templateUrl: './registration.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  readonly stepper = viewChild.required<TailwindStepper>('stepper');

  readonly registerDone = signal(false);
  readonly submitting = signal(false);
  readonly passwordMismatch = signal(false);

  readonly breadcrumb = [
    { label: 'Home', link: '/', icon: 'home' },
    { label: 'Registrazione', link: '/registration' }
  ];

  readonly genders = signal<TailwindOption<RegistrationGender>[]>([]);
  readonly citizenships = signal<TailwindOption<string>[]>([]);

  readonly datiGenerali = new FormGroup<RegistrationGeneralForm>({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    cognome: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    genere: new FormControl<RegistrationGender>('M', { nonNullable: true, validators: [Validators.required] }),
    dataNascita: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    cittadinanza: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    orarioPreferito: new FormControl('09:00', { nonNullable: true }),
    appuntamento: new FormControl<Date | null>(null)
  });

  readonly datiUtente = new FormGroup<RegistrationAccountForm>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(32)]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(32)]
    })
  });

  readonly riepilogo = new FormGroup<RegistrationReviewForm>({
    nome: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    cognome: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    genere: new FormControl<RegistrationGender>({ value: 'M', disabled: true }, { nonNullable: true }),
    dataNascita: new FormControl<Date | null>({ value: null, disabled: true }),
    cittadinanza: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    orarioPreferito: new FormControl({ value: '09:00', disabled: true }, { nonNullable: true }),
    appuntamento: new FormControl<Date | null>({ value: null, disabled: true }),
    username: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8), Validators.maxLength(32)]
    }),
    terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] })
  });

  ngOnInit(): void {
    this.genders.set([
      { label: this.translocoService.translate('REGISTRATION.GENDER_M'), value: 'M' },
      { label: this.translocoService.translate('REGISTRATION.GENDER_F'), value: 'F' },
      { label: this.translocoService.translate('REGISTRATION.GENDER_A'), value: 'A' }
    ]);
    this.citizenships.set([
      { label: 'Italia', value: 'IT' },
      { label: 'Francia', value: 'FR' },
      { label: 'Germania', value: 'DE' },
      { label: 'Spagna', value: 'ES' },
      { label: 'Regno Unito', value: 'GB' },
      { label: 'Stati Uniti', value: 'US' },
      { label: 'Altro', value: 'OTHER' }
    ]);
  }

  genderLabel(value: RegistrationGender): string {
    return this.genders().find(g => g.value === value)?.label ?? value;
  }

  citizenshipLabel(value: string): string {
    return this.citizenships().find(c => c.value === value)?.label ?? value;
  }

  firstStepNext(): void {
    this.datiGenerali.markAllAsTouched();
    if (this.datiGenerali.valid) {
      this.stepper().next();
    }
  }

  secondStepNext(): void {
    this.datiUtente.markAllAsTouched();
    if (this.datiUtente.valid) {
      const general = this.datiGenerali.getRawValue();
      this.riepilogo.patchValue({
        nome: general.nome,
        cognome: general.cognome,
        genere: general.genere,
        dataNascita: general.dataNascita,
        cittadinanza: general.cittadinanza,
        orarioPreferito: general.orarioPreferito,
        appuntamento: general.appuntamento,
        username: this.datiUtente.controls.username.value
      });
      this.passwordMismatch.set(false);
      this.stepper().next();
    }
  }

  submit(): void {
    this.riepilogo.markAllAsTouched();
    this.passwordMismatch.set(false);

    if (!this.riepilogo.valid) {
      return;
    }

    if (this.datiUtente.controls.password.value !== this.riepilogo.controls.confirmPassword.value) {
      this.passwordMismatch.set(true);
      return;
    }

    this.submitting.set(true);
    const payload = {
      ...this.datiGenerali.getRawValue(),
      username: this.datiUtente.controls.username.value,
      password: this.datiUtente.controls.password.value
    };
    console.log('[registration demo]', payload);
    setTimeout(() => {
      this.submitting.set(false);
      this.registerDone.set(true);
    }, 800);
  }

  goToLogin(): void {
    void this.router.navigateByUrl('/login');
  }
}
