import { Component, computed, input, output } from '@angular/core';
import { AtcSeverity, AtcSize } from '../../models';

@Component({
  selector: 'atc-chip',
  standalone: true,
  template: `
    <span [class]="computedClasses()">
      <ng-content />
      @if (removable()) {
        <button type="button" (click)="removed.emit()" class="ml-1 -mr-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer" aria-label="Remove">
          <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      }
    </span>
  `,
  styles: `:host { display: inline-block; }`,
})
export class AtcChip {
  variant = input<AtcSeverity | 'neutral' | 'primary'>('neutral');
  size = input<AtcSize>('md');
  removable = input<boolean>(false);
  removed = output<void>();

  computedClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-100 text-primary-700 border-primary-200',
      neutral: 'bg-surface-100 text-surface-700 border-surface-200',
      success: 'bg-success-100 text-success-700 border-success-200',
      warning: 'bg-warning-100 text-warning-800 border-warning-200',
      danger: 'bg-danger-100 text-danger-700 border-danger-200',
      info: 'bg-info-100 text-info-700 border-info-200',
    };
    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5', sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1', lg: 'text-sm px-3 py-1', xl: 'text-sm px-3.5 py-1.5',
    };
    return `inline-flex items-center font-medium rounded-full border ${variantMap[this.variant()]} ${sizeMap[this.size()]}`;
  });
}
