# Template spec

Sostituisci `TailwindXxx` / `tailwind-xxx` con il componente target. Aggiungi import token o moduli solo se necessari.

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TailwindXxx } from './xxx.component';

describe('TailwindXxx', () => {
  let fixture: ComponentFixture<TailwindXxx>;
  let component: TailwindXxx;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TailwindXxx]
    }).compileComponents();

    fixture = TestBed.createComponent(TailwindXxx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Aggiungi sotto in base al componente ---

  // it('should render label when provided', () => {
  //   fixture.componentRef.setInput('label', 'Test Label');
  //   fixture.detectChanges();
  //   const label = fixture.nativeElement.querySelector('label');
  //   expect(label?.textContent).toContain('Test Label');
  // });

  // it('should emit onX when ...', () => {
  //   const spy = vi.fn();
  //   component.onX.subscribe(spy);
  //   fixture.nativeElement.querySelector('button')!.click();
  //   expect(spy).toHaveBeenCalledTimes(1);
  // });

  // it('should implement CVA writeValue', () => {
  //   component.writeValue('value');
  //   expect(component.value()).toBe('value');
  // });
});
```

## Blocco token opzionale

```typescript
it('should use TOKEN as default when input is omitted', async () => {
  await TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [TailwindXxx],
    providers: [{ provide: SOME_TOKEN, useValue: 'expected' }]
  }).compileComponents();

  const tokenFixture = TestBed.createComponent(TailwindXxx);
  tokenFixture.detectChanges();
  // assert DOM o signal
});
```
