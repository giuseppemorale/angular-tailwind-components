import { Component, computed, input } from '@angular/core';
import { AtcSeverity, AtcSize } from '../../models';

@Component({
  selector: 'atc-badge',
  standalone: true,
  template: `
    <span [class]="computedClasses()" [attr.aria-label]="ariaLabel()">
      @if (dot()) {
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
      }
      <ng-content />
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
    }
  `,
})
export class AtcBadge {
  /** Color variant */
  variant = input<AtcSeverity | 'neutral' | 'primary'>('primary');
  /** Size variant */
  size = input<AtcSize>('md');
  /** Show a dot indicator */
  dot = input<boolean>(false);
  /** Shape variant */
  pill = input<boolean>(false);
  /** Accessible label */
  ariaLabel = input<string>('');

  computedClasses = computed(() => {
    const base = [
      'inline-flex items-center gap-1 font-medium',
      'leading-none',
    ];

    const variantMap: Record<string, string> = {
      primary: 'bg-primary-100 text-primary-700',
      neutral: 'bg-surface-100 text-surface-700',
      success: 'bg-success-100 text-success-700',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-700',
      info: 'bg-info-100 text-info-700',
    };

    const sizeMap: Record<AtcSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-xs px-2.5 py-1',
      lg: 'text-sm px-3 py-1',
      xl: 'text-sm px-3.5 py-1.5',
    };

    const shape = this.pill() ? 'rounded-full' : 'rounded-md';

    return [...base, variantMap[this.variant()] ?? variantMap['primary'], sizeMap[this.size()], shape].join(' ');
  });
}
