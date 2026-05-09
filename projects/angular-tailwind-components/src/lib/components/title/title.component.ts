import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { TailwindSolarIcon, TailwindTitleTag } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

@Component({
  selector: 'tailwind-title',
  imports: [NgTemplateOutlet, TailwindIcon],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TailwindTitle extends TailwindComponent {
  /** Visible title text */
  readonly text = input.required<string>();

  /** Optional Solar Line Duotone icon name (shown before `text`) */
  readonly icon = input<TailwindSolarIcon | undefined>();

  /** HTML heading element */
  readonly titleTag = input<TailwindTitleTag>('h2');

  readonly headingClasses = computed(() => {
    const tag = this.titleTag();
    const scale: Record<TailwindTitleTag, string> = {
      h1: 'text-3xl font-bold tracking-tight text-surface-900',
      h2: 'text-2xl font-semibold tracking-tight text-surface-900',
      h3: 'text-xl font-semibold tracking-tight text-surface-900',
      h4: 'text-lg font-normal text-surface-900',
      h5: 'text-base font-normal text-surface-900',
      h6: 'text-sm font-normal text-surface-800 uppercase tracking-wide'
    };
    const layout = 'inline-flex items-center gap-2 min-w-0';
    const extra = this.class();
    const base = `${scale[tag]} ${layout}`.trim();
    return extra ? `${base} ${extra}`.trim() : base;
  });
}
