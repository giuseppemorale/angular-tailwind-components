import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TailwindTimelineModule } from './timeline.module';

// Il modulo è l'unico import dell'host: se un declarable della famiglia non è esportato, il template non si applica.
@Component({
  imports: [TailwindTimelineModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-timeline ariaLabel="History">
      <tailwind-timeline-item title="First">One</tailwind-timeline-item>
      <tailwind-timeline-item title="Second" [last]="true">Two</tailwind-timeline-item>
    </tailwind-timeline>
  `
})
class TimelineModuleHostComponent {}

describe('TailwindTimelineModule', () => {
  it('should expose timeline and items to a host importing only the module', async () => {
    await TestBed.configureTestingModule({ imports: [TimelineModuleHostComponent] }).compileComponents();

    const fixture = TestBed.createComponent(TimelineModuleHostComponent);
    fixture.detectChanges();

    const list: HTMLElement = fixture.nativeElement.querySelector('ol');
    expect(list.getAttribute('aria-label')).toBe('History');
    expect(list.querySelectorAll('li').length).toBe(2);
  });
});
