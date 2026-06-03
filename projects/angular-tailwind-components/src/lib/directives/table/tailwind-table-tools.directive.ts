import { Directive } from '@angular/core';

/** Marks projected content for the table toolbar (right side, beside search). */
@Directive({
  selector: '[tailwind-table-tools]'
})
export class TailwindTableToolsDirective {}
