import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * Row definition for `TailwindTable`. Prefer structural syntax on `<tbody>`:
 * `<tbody *tailwindTableRow="let row">...</tbody>` — each rendered fragment is one `<tbody>` per data row.
 *
 * Legacy: `<ng-template tailwindTableRow let-row>` with only `<td>` cells still works.
 */
@Directive({
  selector: '[tailwindTableRow]',
  standalone: true
})
export class TailwindTableRowDirective {
  readonly templateRef = inject(TemplateRef<{ $implicit: any; index: number }>);
}

/** @deprecated Use TailwindTableRowDirective instead. */
export { TailwindTableRowDirective as TailwindTableRowTemplateDirective };
