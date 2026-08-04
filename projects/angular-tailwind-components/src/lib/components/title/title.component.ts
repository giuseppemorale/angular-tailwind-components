import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { DEFAULT_TAILWIND_TITLE_SCALE, type TailwindHeroicon, type TailwindTitleTag } from '../../models';
import { TAILWIND_TITLE_SCALE } from '../../tokens';
import { TailwindComponent } from '../tailwind.component';
import { TailwindIcon } from '../icon/icon.component';

@Component({
  selector: 'tailwind-title',
  imports: [NgTemplateOutlet, TailwindIcon],
  templateUrl: './title.component.html',
  styleUrl: './title.component.css'
})
export class TailwindTitle extends TailwindComponent {
  private readonly titleScale = inject(TAILWIND_TITLE_SCALE, { optional: true }) ?? DEFAULT_TAILWIND_TITLE_SCALE;

  /** Visible title text */
  readonly text = input.required<string>();

  /** Optional Heroicons outline icon name (shown before `text`) */
  readonly icon = input<TailwindHeroicon | undefined>();

  /** HTML heading element */
  readonly titleTag = input<TailwindTitleTag>('h2');

  readonly headingClasses = computed(() => {
    const tag = this.titleTag();
    return this.mergeClasses(this.titleScale[tag].classes, 'inline-flex items-center gap-2 min-w-0');
  });

  readonly iconSize = computed(() => this.titleScale[this.titleTag()].iconSize);
}
