---
name: generate-component-vitest-test
description: Generates or extends Vitest unit tests for angular-tailwind-components library components using TestBed and vi.fn(). Use when the user asks for component tests, vitest specs, *.component.spec.ts, or test coverage for a component under projects/angular-tailwind-components/src/lib/components/.
---

# Genera test Vitest per componenti libreria

Genera (o estende) `<component>.component.spec.ts` accanto al componente target, seguendo i test già presenti nel repo.

## Target

1. Usa il componente indicato nel prompt (file aperto, path, o nome).
2. Path atteso: `projects/angular-tailwind-components/src/lib/components/<folder>/<name>.component.ts`
3. Output: `projects/angular-tailwind-components/src/lib/components/<folder>/<name>.component.spec.ts`

Se esiste già uno spec, **estendi** senza duplicare test; non riscrivere da zero salvo richiesta esplicita.

## Prima di scrivere

Leggi sempre:

- `<name>.component.ts` (inputs, outputs, `model`, `inject`, CVA, `imports` del `@Component`)
- `<name>.component.html` (ruoli ARIA, elementi interattivi, classi rilevanti)
- Uno spec esistente simile (es. `button`, `input`, `toggle`) per allineare lo stile

## Convenzioni obbligatorie

| Aspetto | Regola |
|--------|--------|
| Runner | Vitest (`vi.fn()`); `types: ["vitest/globals"]` in `tsconfig.spec.json` |
| Setup | `TestBed.configureTestingModule({ imports: [TailwindXxx] })` |
| Describe | Nome classe exportata, es. `describe('TailwindButton', ...)` |
| Inputs | `fixture.componentRef.setInput('prop', value)` + `fixture.detectChanges()` |
| Outputs | `const spy = vi.fn(); component.onX.subscribe(spy);` poi interazione DOM |
| DOM | `fixture.nativeElement.querySelector(...)` |
| CVA | Se implementa `ControlValueAccessor`: test `writeValue`, `setDisabledState` |
| Token | Se `inject(TOKEN, { optional: true })`: test separato con `TestBed.resetTestingModule()` + `providers` |
| Dipendenze | Importa solo ciò che serve; mock CDK/overlay solo se il componente li usa e fallisce senza |

**Non** aggiungere test banali oltre `should create` se non verificano comportamento reale. **Non** testare implementazione interna irrilevante.

## Checklist test da derivare dal componente

Copia e compila mentalmente prima di scrivere:

```
- [ ] should create
- [ ] Input → rendering (label, placeholder, testi errore/helper, varianti)
- [ ] Output → emit su click/change/chiusura
- [ ] Stato disabled (non emette / attributo disabled / isDisabled())
- [ ] CVA (writeValue, setDisabledState) se applicabile
- [ ] Token InjectionToken opzionale se applicabile
- [ ] Accessibilità (role, aria-*) se presenti nel template
- [ ] Classi Tailwind critiche su input significativi (color, kind, hasError)
```

## Scaffold base

Vedi [template.md](template.md). Adatta `TailwindXxx` e gli import.

## Dopo la generazione

Esegui i test **una sola volta** (mai `--watch` né modalità interattiva). Correggi e rilancia solo se serve verificare di nuovo:

```bash
npx ng test angular-tailwind-components --include='src/lib/components/<folder>/<name>.component.spec.ts' --watch=false
```

Dalla root: `npm test -- --include='src/lib/components/<folder>/<name>.component.spec.ts' --watch=false`

## Esempi rapidi

**Output su click:**

```typescript
const spy = vi.fn();
component.onClick.subscribe(spy);
fixture.nativeElement.querySelector('button')!.click();
expect(spy).toHaveBeenCalledTimes(1);
```

**Input disabilitato:**

```typescript
fixture.componentRef.setInput('disabled', true);
fixture.detectChanges();
expect(fixture.nativeElement.querySelector('button')!.disabled).toBe(true);
```

**CVA:**

```typescript
component.writeValue('hello');
expect(component.value()).toBe('hello');
component.setDisabledState(true);
expect(component.isDisabled()).toBe(true);
```

Per casi più articolati, vedi [examples.md](examples.md).
