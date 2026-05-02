import { Component, contentChildren, input, model, effect } from '@angular/core';
import { AtcTab } from './tab.component';

@Component({
  selector: 'atc-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
})
export class AtcTabGroup {
  /** Accessible label for the tab list */
  ariaLabel = input<string>('');
  /** Whether tabs can scroll horizontally */
  scrollable = input<boolean>(false);

  /** Currently active tab index (two-way) */
  activeIndex = model<number>(0);

  /** Query all child AtcTab components */
  tabs = contentChildren(AtcTab);

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
