import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindSafeHtmlPipe } from './safehtml.pipe';

@Component({
  imports: [TailwindSafeHtmlPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div [innerHTML]="html | safehtml"></div>`
})
class SafeHtmlHostComponent {
  html: string | null | undefined = '';
}

describe('TailwindSafeHtmlPipe', () => {
  let fixture: ComponentFixture<SafeHtmlHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeHtmlHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SafeHtmlHostComponent);
  });

  it('should render empty output for nullish values', () => {
    fixture.componentInstance.html = null;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('div')?.innerHTML).toBe('');
  });

  it('should preserve safe anchor tags', () => {
    fixture.componentInstance.html = '<a href="/privacy">terms</a>';
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/privacy');
    expect(link?.textContent).toContain('terms');
  });

  it('should strip script tags', () => {
    fixture.componentInstance.html = '<script>alert(1)</script><span>ok</span>';
    fixture.detectChanges();

    const div = fixture.nativeElement.querySelector('div');
    expect(div?.innerHTML).not.toContain('<script');
    expect(div?.textContent).toContain('ok');
  });
});
