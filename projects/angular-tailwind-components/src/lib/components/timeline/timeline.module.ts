import { NgModule } from '@angular/core';
import { TailwindTimeline } from './timeline.component';
import { TailwindTimelineItem } from './timeline-item.component';

/** Timeline and its items. */
@NgModule({
  imports: [TailwindTimeline, TailwindTimelineItem],
  exports: [TailwindTimeline, TailwindTimelineItem]
})
export class TailwindTimelineModule {}
