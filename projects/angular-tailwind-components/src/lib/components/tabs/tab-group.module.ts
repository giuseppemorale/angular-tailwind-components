import { NgModule } from '@angular/core';
import { TailwindTabGroup } from './tab-group.component';
import { TailwindTab } from './tab.component';

/** Tab group and its tabs. */
@NgModule({
  imports: [TailwindTabGroup, TailwindTab],
  exports: [TailwindTabGroup, TailwindTab]
})
export class TailwindTabGroupModule {}
