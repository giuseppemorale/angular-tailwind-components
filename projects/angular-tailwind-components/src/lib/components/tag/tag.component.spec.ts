import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTag } from './tag.component';

describe('TailwindTag', () => {
  let fixture: ComponentFixture<TailwindTag>;
  let component: TailwindTag;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindTag]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function surface(): HTMLElement {
    return fixture.nativeElement.querySelector('span');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the neutral palette', () => {
    expect(surface().className).toContain('neutral');
  });

  it('should switch palette with the color input', () => {
    fixture.componentRef.setInput('color', 'success');
    fixture.detectChanges();
    expect(surface().className).toContain('success');
  });

  it('should forward consumer classes onto the surface', () => {
    fixture.componentRef.setInput('class', 'uppercase');
    fixture.detectChanges();
    expect(surface().className).toContain('uppercase');
  });
});
