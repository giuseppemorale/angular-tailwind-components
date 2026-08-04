import { Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindHeroicon, TailwindIconSize } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class TailwindMessage extends TailwindComponent {
  readonly color = input<TailwindColor>('info');
  /** Heroicons outline name; omit to hide the leading icon. */
  readonly icon = input<TailwindHeroicon | undefined>();
  /** Icon size in px when {@link icon} is set. */
  readonly iconSize = input<TailwindIconSize>(20);

  readonly computedClasses = computed(() => {
    const colorMap: Record<TailwindColor, string> = {
      primary: 'bg-primary-50 text-primary-700 border-primary-200',
      secondary: 'bg-neutral-50 text-neutral-700 border-neutral-200',
      success: 'bg-success-50 text-success-700 border-success-200',
      warning: 'bg-warning-50 text-warning-700 border-warning-200',
      danger: 'bg-danger-50 text-danger-700 border-danger-200',
      info: 'bg-info-50 text-info-700 border-info-200',
      transparent: 'bg-transparent text-neutral-700 border-neutral-200'
    };
    return this.mergeClasses('flex items-center gap-2 text-sm px-3 py-2 rounded-md border', colorMap[this.color()]);
  });

  readonly iconClasses = computed(() => {
    const iconMap: Record<TailwindColor, string> = {
      primary: 'text-primary-600',
      secondary: 'text-neutral-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      danger: 'text-danger-600',
      info: 'text-info-600',
      transparent: 'text-neutral-500'
    };
    return `shrink-0 ${iconMap[this.color()]}`;
  });
}
