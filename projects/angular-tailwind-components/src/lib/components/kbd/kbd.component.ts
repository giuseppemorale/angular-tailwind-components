import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

/**
 * A keyboard key, rendered as the native `<kbd>` element. `keys` renders a whole chord with
 * separators hidden from screen readers, so "Ctrl + K" is announced as the keys alone.
 */
@Component({
  selector: 'tailwind-kbd',
  templateUrl: './kbd.component.html',
  styleUrl: './kbd.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindKbd extends TailwindComponent {
  /** Several keys pressed together, e.g. `['Ctrl', 'K']`. Ignored when content is projected. */
  readonly keys = input<string[]>([]);
  /** Separator drawn between keys. */
  readonly separator = input<string>('+');

  readonly keyClasses = computed(() =>
    this.mergeClasses(
      'inline-flex min-w-6 items-center justify-center rounded-control-inner border border-border-strong',
      'border-b-2 bg-surface px-1.5 py-0.5 font-mono text-xs font-medium text-neutral-700 shadow-xs'
    )
  );
}
