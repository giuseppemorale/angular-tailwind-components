import { Component, computed, input, output, signal } from '@angular/core';
import { AtcSeverity } from '../../models';

@Component({
  selector: 'atc-notification',
  standalone: true,
  template: `
    @if (!dismissed()) {
      <div [class]="computedClasses()" role="alert">
        <div class="flex gap-3">
          <div class="flex-1 min-w-0">
            @if (title()) { <p class="text-sm font-semibold mb-0.5">{{ title() }}</p> }
            <p class="text-sm"><ng-content /></p>
            @if (showActions()) {
              <div class="flex gap-2 mt-3">
                <ng-content select="[atcNotificationActions]" />
              </div>
            }
          </div>
          @if (dismissible()) {
            <button type="button" (click)="dismiss()" class="shrink-0 p-1 -m-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer" aria-label="Dismiss">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: `:host { display: block; }`,
})
export class AtcNotification {
  title = input<string>('');
  severity = input<AtcSeverity>('info');
  dismissible = input<boolean>(true);
  showActions = input<boolean>(false);
  dismissed$ = output<void>();
  dismissed = signal(false);

  computedClasses = computed(() => {
    const variantMap: Record<AtcSeverity, string> = {
      success: 'bg-success-50 border-success-200 text-success-800',
      warning: 'bg-warning-50 border-warning-200 text-warning-800',
      danger: 'bg-danger-50 border-danger-200 text-danger-800',
      info: 'bg-info-50 border-info-200 text-info-800',
    };
    return `rounded-xl border p-4 ${variantMap[this.severity()]}`;
  });

  dismiss(): void { this.dismissed.set(true); this.dismissed$.emit(); }
}
