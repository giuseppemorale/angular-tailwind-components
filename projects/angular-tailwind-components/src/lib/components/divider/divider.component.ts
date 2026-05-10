import { Component, computed, input } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-divider',
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.css'
})
export class TailwindDivider extends TailwindComponent {
  /** Rule direction */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Adds horizontal margin to the rule (horizontal orientation only). */
  readonly inset = input<boolean>(false);
  /** Border style for the rule */
  readonly variant = input<'solid' | 'dashed'>('solid');
  /** Centered text between two lines (horizontal only; ignored when empty). */
  readonly label = input<string>('');

  readonly isLabeledHorizontal = computed(
    () => this.orientation() === 'horizontal' && !!this.label()?.trim()
  );

  readonly ruleClasses = computed(() => {
    const inset = this.inset() && this.orientation() === 'horizontal' ? 'mx-4' : '';
    const variant = this.variant() === 'dashed' ? 'border-dashed' : 'border-solid';

    if (this.orientation() === 'vertical') {
      return ['self-stretch shrink-0 w-px min-h-full border-0 border-l', variant, 'border-surface-200']
        .join(' ');
    }

    return ['w-full border-0 border-t', variant, 'border-surface-200', inset].filter(Boolean).join(' ');
  });

  /** Top rule for labeled horizontal layout */
  readonly ruleLineClass = computed(() => {
    const variant = this.variant() === 'dashed' ? 'border-dashed' : 'border-solid';
    return ['border-surface-200', variant].join(' ');
  });

  readonly labeledRowClass = computed(() =>
    this.inset() ? 'flex items-center gap-3 w-full mx-4' : 'flex items-center gap-3 w-full'
  );
}
