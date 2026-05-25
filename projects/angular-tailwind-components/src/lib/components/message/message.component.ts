import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindPalette } from '../../models';
import { feedbackSurfaceClasses } from '../../utils/palette.util';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindMessage extends TailwindComponent {
  readonly color = input<TailwindPalette>('sky');

  readonly computedClasses = computed(() => {
    return `text-sm px-3 py-2 rounded-lg border ${feedbackSurfaceClasses(this.color())}`;
  });
}
