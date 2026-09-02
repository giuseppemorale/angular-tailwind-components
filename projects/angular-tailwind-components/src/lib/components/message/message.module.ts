import { NgModule } from '@angular/core';
import { TailwindMessage } from './message.component';

@NgModule({
  imports: [TailwindMessage],
  exports: [TailwindMessage]
})
export class TailwindMessageModule {}
