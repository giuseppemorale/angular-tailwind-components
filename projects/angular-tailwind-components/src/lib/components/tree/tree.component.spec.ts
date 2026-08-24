import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindTree } from './tree.component';
import type { TailwindTreeNode } from './interfaces/tree-node.interface';

const NODES: TailwindTreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      { key: 'app', label: 'app', children: [{ key: 'main.ts', label: 'main.ts' }] },
      { key: 'styles.css', label: 'styles.css' }
    ]
  },
  { key: 'readme', label: 'README.md' },
  { key: 'locked', label: 'node_modules', disabled: true, children: [{ key: 'x', label: 'x' }] }
];

describe('TailwindTree', () => {
  let fixture: ComponentFixture<TailwindTree>;
  let component: TailwindTree;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindTree]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindTree);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', NODES);
    fixture.detectChanges();
  });

  function rows(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="treeitem"]'));
  }

  function press(key: string): void {
    fixture.nativeElement
      .querySelector('[role="tree"]')
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render only the root rows while everything is collapsed', () => {
    expect(rows().map(r => r.textContent?.trim())).toEqual(['src', 'README.md', 'node_modules']);
  });

  it('should expose level and expandability per row', () => {
    const [first, , third] = rows();
    expect(first.getAttribute('aria-level')).toBe('1');
    expect(first.getAttribute('aria-expanded')).toBe('false');
    // A leaf has no expanded state at all.
    expect(rows()[1].getAttribute('aria-expanded')).toBeNull();
    expect(third.getAttribute('aria-disabled')).toBe('true');
  });

  it('should reveal children when a branch is expanded', () => {
    press('ArrowRight');

    expect(rows().map(r => r.textContent?.trim())).toEqual(['src', 'app', 'styles.css', 'README.md', 'node_modules']);
    expect(rows()[0].getAttribute('aria-expanded')).toBe('true');
    expect(rows()[1].getAttribute('aria-level')).toBe('2');
  });

  it('should collapse again with ArrowLeft', () => {
    press('ArrowRight');
    press('ArrowLeft');

    expect(rows().length).toBe(3);
    expect(rows()[0].getAttribute('aria-expanded')).toBe('false');
  });

  it('should climb to the parent with ArrowLeft on a leaf', () => {
    press('ArrowRight'); // expand src
    press('ArrowDown'); // focus "app"
    press('ArrowLeft'); // "app" is collapsed, so focus climbs to "src"

    expect(component.visibleNodes()[0].key).toBe('src');
    expect(rows()[0].getAttribute('tabindex')).toBe('0');
  });

  it('should keep a single tab stop and move it with the arrows', () => {
    expect(rows().map(r => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);

    press('ArrowDown');
    expect(rows().map(r => r.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);

    press('End');
    expect(rows().map(r => r.getAttribute('tabindex'))).toEqual(['-1', '-1', '0']);

    press('Home');
    expect(rows().map(r => r.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
  });

  it('should select a row on click and report it', () => {
    const spy = vi.fn();
    component.nodeSelect.subscribe(spy);

    rows()[1].click();
    fixture.detectChanges();

    expect(component.selectedKey()).toBe('readme');
    expect(rows()[1].getAttribute('aria-selected')).toBe('true');
    expect(spy.mock.calls[0][0].label).toBe('README.md');
  });

  it('should refuse to select or expand a disabled node', () => {
    const selectSpy = vi.fn();
    const toggleSpy = vi.fn();
    component.nodeSelect.subscribe(selectSpy);
    component.nodeToggle.subscribe(toggleSpy);

    rows()[2].click();
    fixture.detectChanges();

    expect(selectSpy).not.toHaveBeenCalled();
    expect(component.selectedKey()).toBeNull();

    component.toggle(component.visibleNodes()[2]);
    expect(toggleSpy).not.toHaveBeenCalled();
  });

  it('should build keys from the whole path so duplicate labels stay distinct', () => {
    press('ArrowRight'); // expand src
    press('ArrowDown'); // app
    press('ArrowRight'); // expand app

    expect(component.visibleNodes().map(n => n.key)).toContain('src/app/main.ts');
  });
});
