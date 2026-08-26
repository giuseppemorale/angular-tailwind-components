import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TailwindColor, TailwindVariantKind } from '../../models';
import { semanticSurface } from '../../util/variants';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindTag extends TailwindComponent {
  readonly color = input<TailwindColor>('secondary');
  /** How the surface is painted; `solid` (default) is the tag's long-standing look. */
  readonly kind = input<TailwindVariantKind>('solid');

  readonly computedClasses = computed(() =>
    this.mergeClasses(
      'inline-flex items-center border text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-control-inner',
      semanticSurface(this.kind(), this.color())
    )
  );
}
