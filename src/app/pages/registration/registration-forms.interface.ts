import { FormControl } from '@angular/forms';

export type RegistrationGender = 'M' | 'F' | 'A';

export interface RegistrationGeneralForm {
  nome: FormControl<string>;
  cognome: FormControl<string>;
  genere: FormControl<RegistrationGender>;
  dataNascita: FormControl<Date | null>;
  cittadinanza: FormControl<string>;
}

export interface RegistrationAccountForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface RegistrationReviewForm {
  nome: FormControl<string>;
  cognome: FormControl<string>;
  genere: FormControl<RegistrationGender>;
  dataNascita: FormControl<Date | null>;
  cittadinanza: FormControl<string>;
  username: FormControl<string>;
  confirmPassword: FormControl<string>;
  terms: FormControl<boolean>;
}
