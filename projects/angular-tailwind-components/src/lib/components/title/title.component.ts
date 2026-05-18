import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import type { TailwindHeroicon, TailwindTitleTag } from '../../models';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

@Component({
  selector: 'tailwind-title',
  imports: [NgTemplateOutlet, TailwindIcon],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TailwindTitle extends TailwindComponent {
  /** Visible title text */
  readonly text = input.required<string>();

  /** Optional Heroicons outline icon name (shown before `text`) */
  readonly icon = input<TailwindHeroicon | undefined>();

  /** HTML heading element */
  readonly titleTag = input<TailwindTitleTag>('h2');

  readonly headingClasses = computed(() => {
    const tag = this.titleTag();
    const scale: Record<TailwindTitleTag, string> = {
      h1: 'text-3xl font-bold tracking-tight text-neutral-900',
      h2: 'text-2xl font-semibold tracking-tight text-neutral-900',
      h3: 'text-xl font-semibold tracking-tight text-neutral-900',
      h4: 'text-lg font-normal text-neutral-900',
      h5: 'text-base font-normal text-neutral-900',
      h6: 'text-sm font-normal text-neutral-800 uppercase tracking-wide'
    };
    const layout = 'inline-flex items-center gap-2 min-w-0';
    const extra = this.class();
    const base = `${scale[tag]} ${layout}`.trim();
    return extra ? `${base} ${extra}`.trim() : base;
  });

  readonly iconSize = computed(() => {
    const tag = this.titleTag();
    const size: Record<TailwindTitleTag, number> = {
      h1: 32,
      h2: 24,
      h3: 20,
      h4: 18,
      h5: 16,
      h6: 14
    };
    return size[tag];
  });
}
