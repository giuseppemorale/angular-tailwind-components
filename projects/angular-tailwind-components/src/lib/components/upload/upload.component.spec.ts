import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindUpload } from './upload.component';

describe('TailwindUpload', () => {
  let fixture: ComponentFixture<TailwindUpload>;
  let component: TailwindUpload;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindUpload]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render drop zone when variant is area', () => {
    fixture.componentRef.setInput('variant', 'area');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="button"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Drag and drop');
  });

  it('should render trigger button when variant is button', () => {
    fixture.componentRef.setInput('variant', 'button');
    fixture.componentRef.setInput('buttonLabel', 'Upload');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="button"]')).toBeNull();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(fixture.nativeElement.textContent).toContain('Upload');
  });

  it('should implement CVA writeValue', () => {
    component.writeValue('data:image/png;base64,abc');
    expect(component.value()).toBe('data:image/png;base64,abc');
  });

  it('should implement CVA setDisabledState', () => {
    component.setDisabledState(true);
    expect(component.isDisabled()).toBe(true);
  });

  it('should clear value', () => {
    component.writeValue('data:image/png;base64,abc');
    fixture.detectChanges();
    component.clear();
    expect(component.value()).toBe('');
  });
});
