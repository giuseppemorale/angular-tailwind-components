import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtcAlert } from './alert';

describe('AtcAlert', () => {
  let fixture: ComponentFixture<AtcAlert>;
  let component: AtcAlert;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtcAlert],
    }).compileComponents();

    fixture = TestBed.createComponent(AtcAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.componentRef.setInput('title', 'Test Alert');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3');
    expect(title?.textContent).toContain('Test Alert');
  });

  it('should dismiss when dismissible', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const spy = vi.fn();
    component.dismissed$.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(component.dismissed()).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should have alert role', () => {
    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
  });
});
