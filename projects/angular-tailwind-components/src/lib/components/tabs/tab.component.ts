import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'atc-tab',
  standalone: true,
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
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
