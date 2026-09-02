import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindAccordionModule } from './accordion.module';

// Il modulo è l'unico import dell'host: se un declarable della famiglia non è esportato, il template non si applica.
@Component({
  imports: [TailwindAccordionModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-accordion>
      <tailwind-accordion-item title="First">Content one</tailwind-accordion-item>
      <tailwind-accordion-item title="Second">Content two</tailwind-accordion-item>
    </tailwind-accordion>
  `
})
class AccordionModuleHostComponent {}

describe('TailwindAccordionModule', () => {
  it('should expose accordion and item to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [AccordionModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(AccordionModuleHostComponent);
    fixture.detectChanges();

    const triggers: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button[aria-expanded]'));
    expect(triggers.length).toBe(2);
    expect(triggers.map(t => t.getAttribute('aria-expanded'))).toEqual(['false', 'false']);
  });
});
