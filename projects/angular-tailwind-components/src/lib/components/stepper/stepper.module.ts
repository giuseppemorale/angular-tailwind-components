import { NgModule } from '@angular/core';
import { TailwindStepper } from './stepper.component';
import { TailwindStep } from './step.component';

/** Stepper and its steps. */
@NgModule({
  imports: [TailwindStepper, TailwindStep],
  exports: [TailwindStepper, TailwindStep]
})
export class TailwindStepperModule {}
