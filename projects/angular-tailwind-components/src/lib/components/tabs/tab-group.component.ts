import { Component, contentChildren, input, model, effect } from '@angular/core';
import { TailwindTab } from './tab.component';

@Component({
  selector: 'tailwind-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss'
})
export class TailwindTabGroup {
  /** Accessible label for the tab list */
  readonly ariaLabel = input<string>('');
  /** Whether tabs can scroll horizontally */
  readonly scrollable = input<boolean>(false);

  /** Currently active tab index (two-way) */
  readonly activeIndex = model<number>(0);

  /** Query all child TailwindTab components */
  tabs = contentChildren(TailwindTab);

  constructor() {
    effect(() => {
      const allTabs = this.tabs();
      const idx = this.activeIndex();
      allTabs.forEach((tab, i) => tab.isActive.set(i === idx));
    });
  }

  selectTab(index: number): void {
    this.activeIndex.set(index);
  }
}
