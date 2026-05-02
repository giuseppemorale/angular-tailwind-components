import { Component, computed, input } from '@angular/core';
import { AtcSeverity } from '../../models';

@Component({
  selector: 'atc-tag',
  standalone: true,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class AtcTag {
  variant = input<AtcSeverity | 'neutral' | 'primary'>('neutral');

  computedClasses = computed(() => {
    const variantMap: Record<string, string> = {
      primary: 'bg-primary-600 text-white', neutral: 'bg-surface-600 text-white',
      success: 'bg-success-600 text-white', warning: 'bg-warning-500 text-surface-900',
      danger: 'bg-danger-600 text-white', info: 'bg-info-600 text-white',
    };
    return `inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${variantMap[this.variant()]}`;
  });
}
