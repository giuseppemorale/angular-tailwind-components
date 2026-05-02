import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'tailwind-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TailwindTab {
  /** Tab label */
  label = input.required<string>();
  /** Tab icon (optional, CSS class or content) */
  readonly icon = input<string>('');
  /** Whether the tab is disabled */
  readonly disabled = input<boolean>(false);
  /** Unique identifier */
  readonly tabId = input<string>(`tailwind-tab-${nextTabId++}`);

  /** Whether this tab is the currently active one (set by parent) */
  readonly isActive = signal(false);
}

let nextTabId = 0;
