import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindMenuItem } from '../../models';
import { TailwindToolbar } from './toolbar.component';

describe('TailwindToolbar', () => {
  let fixture: ComponentFixture<TailwindToolbar>;
  let component: TailwindToolbar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindToolbar]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect submenu entries', () => {
    const parent: TailwindMenuItem = {
      label: 'More',
      items: [{ label: 'Child', value: 'child' }]
    };
    expect(component.hasSubmenu(parent)).toBe(true);
    expect(component.hasSubmenu({ label: 'Home', value: 'home' })).toBe(false);
  });

  it('should not emit onMenuSelect for parent entries with items', () => {
    const spy = vi.fn();
    component.onMenuSelect.subscribe(spy);

    component.selectMenuItem({
      label: 'More',
      items: [{ label: 'Child', value: 'child' }]
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit onMenuSelect for leaf entries', () => {
    const spy = vi.fn();
    component.onMenuSelect.subscribe(spy);
    const leaf: TailwindMenuItem = { label: 'Home', value: 'home' };

    component.selectMenuItem(leaf);

    expect(spy).toHaveBeenCalledWith(leaf);
  });

  it('should flatten submenu children for mobile menu items', () => {
    const menu: TailwindMenuItem[] = [
      { label: 'Home', value: 'home' },
      {
        label: 'More',
        items: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' }
        ]
      }
    ];
    fixture.componentRef.setInput('menu', menu);
    fixture.detectChanges();

    expect(component.mobileMenuItems()).toEqual([
      { label: 'Home', value: 'home' },
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' }
    ]);
  });

  it('should use bottom placement for horizontal submenus', () => {
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(component.submenuPlacement()).toBe('bottom');
  });

  it('should use right placement for vertical submenus', () => {
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect(component.submenuPlacement()).toBe('right');
  });

  it('should return trimmed tooltip text or empty string', () => {
    expect(component.menuItemTooltip({ value: 'home', tooltip: '  Home  ' })).toBe('Home');
    expect(component.menuItemTooltip({ value: 'home' })).toBe('');
    expect(component.menuItemTooltip({ value: 'home', tooltip: '   ' })).toBe('');
  });

  it('should default tooltip position to right and honor item override', () => {
    expect(component.menuItemTooltipPosition({ value: 'home', tooltip: 'Home' })).toBe('right');
    expect(
      component.menuItemTooltipPosition({ value: 'settings', tooltip: 'Settings', tooltipPosition: 'left' })
    ).toBe('left');
  });
});
