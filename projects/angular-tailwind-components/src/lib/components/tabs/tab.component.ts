import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTab extends TailwindComponent {
  /** Tab label */
  readonly label = input.required<string>();
  /** Tab icon (optional, CSS class or content) */
  readonly icon = input<string>('');
  /** Whether the tab is disabled */
  readonly disabled = input<boolean>(false);
  /** Whether this tab is the currently active one (set by parent) */
  readonly isActive = signal(false);

  /**
   * Ids linking the `role="tab"` button in the tab group with this `role="tabpanel"`.
   * Derived from `elementId()`, so the association holds even when the consumer omits `id`.
   */
  readonly tabId = computed(() => `${this.elementId()}-tab`);
  readonly panelId = computed(() => `${this.elementId()}-panel`);
}
