import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindKbd } from './kbd.component';

describe('TailwindKbd', () => {
  let fixture: ComponentFixture<TailwindKbd>;
  let component: TailwindKbd;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindKbd]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindKbd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a native kbd element', () => {
    expect(fixture.nativeElement.querySelector('kbd')).toBeTruthy();
  });

  it('should render one kbd per key of a chord', () => {
    fixture.componentRef.setInput('keys', ['Ctrl', 'K']);
    fixture.detectChanges();

    const keys = [...fixture.nativeElement.querySelectorAll('kbd')].map((k: Element) => k.textContent?.trim());
    expect(keys).toEqual(['Ctrl', 'K']);
  });

  it('should hide the separator from assistive technology', () => {
    fixture.componentRef.setInput('keys', ['Ctrl', 'K']);
    fixture.detectChanges();

    const separator = fixture.nativeElement.querySelector('span[aria-hidden="true"]');
    expect(separator?.textContent?.trim()).toBe('+');
  });

  it('should accept a custom separator', () => {
    fixture.componentRef.setInput('keys', ['Meta', 'K']);
    fixture.componentRef.setInput('separator', 'then');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span[aria-hidden="true"]')?.textContent?.trim()).toBe('then');
  });
});
