import { NgModule } from '@angular/core';
import { TailwindToast } from './toast.component';

@NgModule({
  imports: [TailwindToast],
  exports: [TailwindToast]
})
export class TailwindToastModule {}
