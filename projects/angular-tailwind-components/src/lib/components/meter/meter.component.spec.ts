import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindMeter } from './meter.component';

describe('TailwindMeter', () => {
  let fixture: ComponentFixture<TailwindMeter>;
  let component: TailwindMeter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindMeter]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindMeter);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('segments', [
      { label: 'IT', value: 51.28205128205128, color: 'primary' },
      { label: 'EN', value: 20.51282051282051, color: 'info' }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format legend values with default zero decimals', () => {
    const legendValues = [...fixture.nativeElement.querySelectorAll('.text-neutral-500')].map(
      (el: Element) => el.textContent?.trim()
    );
    expect(legendValues).toContain('(51)');
    expect(legendValues).toContain('(21)');
  });

  it('should format legend values with custom decimals', () => {
    fixture.componentRef.setInput('decimals', 2);
    fixture.detectChanges();

    const legendValues = [...fixture.nativeElement.querySelectorAll('.text-neutral-500')].map(
      (el: Element) => el.textContent?.trim()
    );
    expect(legendValues).toContain('(51.28)');
    expect(legendValues).toContain('(20.51)');
  });
});
