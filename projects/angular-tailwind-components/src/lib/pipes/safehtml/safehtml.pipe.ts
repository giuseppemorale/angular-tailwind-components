import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safehtml',
  standalone: true
})
export class TailwindSafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    const cleaned = this.sanitizer.sanitize(SecurityContext.HTML, value ?? '') ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(cleaned);
  }
}
