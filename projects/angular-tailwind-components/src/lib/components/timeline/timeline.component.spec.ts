import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTimeline } from './timeline.component';
import { TailwindTimelineItem } from './timeline-item.component';

@Component({
  imports: [TailwindTimeline, TailwindTimelineItem],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-timeline ariaLabel="Order history">
      <tailwind-timeline-item title="Placed" time="09:00" color="success">Order received</tailwind-timeline-item>
      <tailwind-timeline-item title="Shipped" time="12:30" icon="truck" />
      <tailwind-timeline-item title="Delivered" [last]="true" />
    </tailwind-timeline>
  `
})
class TimelineHostComponent {}

describe('TailwindTimeline', () => {
  let fixture: ComponentFixture<TimelineHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineHostComponent);
    fixture.detectChanges();
  });

  it('should render an ordered list, because the sequence carries meaning', () => {
    const list: HTMLElement = fixture.nativeElement.querySelector('ol');
    expect(list).toBeTruthy();
    expect(list.getAttribute('aria-label')).toBe('Order history');
    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(3);
  });

  it('should render title, time and projected body', () => {
    const first: HTMLElement = fixture.nativeElement.querySelector('li');
    expect(first.textContent).toContain('Placed');
    expect(first.textContent).toContain('09:00');
    expect(first.textContent).toContain('Order received');
  });

  it('should hide the connector on the last item only', () => {
    const items = [...fixture.nativeElement.querySelectorAll('li')] as HTMLElement[];
    const connectors = items.map(li => li.querySelectorAll('span[aria-hidden="true"].w-px').length);
    expect(connectors).toEqual([1, 1, 0]);
  });

  it('should use the semantic colour on the marker', () => {
    const marker: HTMLElement = fixture.nativeElement.querySelector('li span');
    expect(marker.className).toContain('bg-success-600');
  });

  it('should render an icon inside the marker when given', () => {
    const second = [...fixture.nativeElement.querySelectorAll('li')][1] as HTMLElement;
    expect(second.querySelector('tailwind-icon')).toBeTruthy();
  });
});
