import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TailwindPalette } from '../../models';
import { feedbackSurfaceClasses } from '../../utils/palette.util';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindButton],
  selector: 'tailwind-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindNotification extends TailwindComponent {
  readonly title = input<string>('');
  readonly color = input<TailwindPalette>('sky');
  readonly dismissible = input<boolean>(true);
  readonly showActions = input<boolean>(false);

  readonly onDismiss = output<void>();

  readonly computedClasses = computed(() => {
    return `flex items-start rounded-lg border p-4 ${feedbackSurfaceClasses(this.color())}`;
  });
}
