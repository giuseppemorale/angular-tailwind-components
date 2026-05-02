import { Component, contentChildren, input, model, signal, computed, AfterContentInit, effect } from '@angular/core';

@Component({
  selector: 'atc-tab',
  standalone: true,
  template: `
    @if (isActive()) {
      <div role="tabpanel" [attr.aria-labelledby]="'tab-' + tabId()">
        <ng-content />
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AtcTab {
  /** Tab label */
  label = input.required<string>();
  /** Tab icon (optional, CSS class or content) */
  icon = input<string>('');
  /** Whether the tab is disabled */
  disabled = input<boolean>(false);
  /** Unique identifier */
  tabId = input<string>(`atc-tab-${nextTabId++}`);

  /** Whether this tab is the currently active one (set by parent) */
  isActive = signal(false);
}

let nextTabId = 0;

@Component({
  selector: 'atc-tab-group',
  standalone: true,
  imports: [AtcTab],
  template: `
    <!-- Tab Headers -->
    <div class="border-b border-surface-200" role="tablist" [attr.aria-label]="ariaLabel()">
      <nav class="flex -mb-px gap-1" [class.overflow-x-auto]="scrollable()">
        @for (tab of tabs(); track tab.tabId(); let i = $index) {
          <button
            type="button"
            role="tab"
            [id]="'tab-' + tab.tabId()"
            [attr.aria-selected]="activeIndex() === i"
            [attr.aria-controls]="tab.tabId()"
            [disabled]="tab.disabled()"
            class="group relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:rounded-t-lg"
            [class.text-primary-600]="activeIndex() === i"
            [class.text-surface-500]="activeIndex() !== i"
            [class.hover:text-surface-700]="activeIndex() !== i && !tab.disabled()"
            [class.opacity-50]="tab.disabled()"
            [class.cursor-not-allowed]="tab.disabled()"
            (click)="!tab.disabled() && selectTab(i)"
          >
            {{ tab.label() }}
            <!-- Active indicator -->
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
              [class.bg-primary-600]="activeIndex() === i"
              [class.scale-x-100]="activeIndex() === i"
              [class.scale-x-0]="activeIndex() !== i"
            ></span>
          </button>
        }
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="pt-4">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
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
