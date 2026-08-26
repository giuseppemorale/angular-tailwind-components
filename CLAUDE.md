# angular-tailwind-components

Libreria di componenti UI Angular basata su Tailwind CSS v4 (signals, standalone components).

- Libreria: `projects/angular-tailwind-components/src/lib/components/`
- Storybook: `storybook/components/<name>/`
- Playground: `src/`

## Comandi

| Scopo             | Comando                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dev playground    | `npm start`                                                                                                                                                   |
| Build libreria    | `npm run build`                                                                                                                                               |
| Storybook         | `npm run storybook`                                                                                                                                           |
| Prettier          | `npm run prettier:write`                                                                                                                                      |
| Test singolo spec | `npx ng test angular-tailwind-components --include='projects/angular-tailwind-components/src/lib/components/<folder>/<nome>.component.spec.ts' --watch=false` |

Il percorso di `--include` è **relativo alla radice del workspace**, non a `sourceRoot`.

Per i test usa **sempre un comando secco**: mai `ng test --watch`, mai processi in background.

---

# Commenti

- **Sintetici.** Un JSDoc su API pubblica = **una riga**; due o tre solo se serve un esempio o una regola non ovvia.
- Niente paragrafi di motivazione storica ("prima era così…", "esiste perché…") né racconti di design.
- Non ripetere il codice: `/** Whether the button is disabled */` su `disabled` è rumore.
- Commenta solo ciò che il codice non dice: vincoli, workaround, requisiti WCAG/APG, effetti collaterali.

---

# Componenti Angular

Ambito: `projects/angular-tailwind-components/src/lib/components/**`

Ogni componente estende `TailwindComponent`, selector `tailwind-<nome>`, classe `Tailwind<Nome>`, dipendenze dichiarate in `imports` del `@Component`.

## Struttura cartella

Riferimento: `calendar-panel/`.

**Root del componente** — solo artefatti Angular:

- `*.component.ts`, `*.component.html`, `*.component.css` (o `.scss`), `*.component.spec.ts`
- Più componenti nella stessa cartella (es. `accordion/`, `tabs/`): stesso pattern per ogni componente

Il `.component.ts` contiene **solo la classe del componente** e il suo `@Component`: niente `const`, `type`, `interface` o funzioni a livello di modulo. Stessa regola per `*.service.ts`, `*.directive.ts`, `*.pipe.ts` e per i provider.

**Sottocartelle semantiche** per il resto:

- `properties/constant.ts` — **tutte le costanti** del componente (mappe di classi Tailwind, durate, posizioni CDK, …), esportate. Riferimento: `button/properties/constant.ts`
- `interfaces/` — tipi e interfacce, anche quelli usati solo internamente (es. `segmented-control/interfaces/thumb-geometry.interface.ts`)
- `util/` — funzioni pure, helper, i18n, logica di vista (es. `calendar-date-range.ts`)
- `models/` — enum / modelli di dominio

Se un tipo o una costante spostata era parte dell'API pubblica, aggiungi il re-export in `components/index.ts` (o `providers/index.ts`) per non rompere `public-api`.

Spec dei file in `util/`: `util/<nome>.spec.ts` accanto al sorgente.

## Inoltro `class` (surface)

- `TailwindComponent` espone `class` / `mergeClasses(...bases)` — **non** legare `class()` sull'host.
- Applicare sempre `mergeClasses(classiStrutturali, …)` sull'**elemento surface** (radice visiva nel template o controllo nativo).
- Host wrapper: `:host { display: contents; }` quando il surface deve partecipare a grid/flex del genitore.
- **Vietato:** `:host(.nome-classe-utente)`, `class().includes('…')` o logica su singole utility Tailwind.
- Layout interno fisso del componente (es. card `flex flex-col`, body `flex-1`) = classi base del surface / figli, non condizionate a `class()` utente.

## Signals

- API pubblica: `input()`, `output()`, `model()` — non decorator `@Input` / `@Output`.
- Stato interno: `signal()`; derivati: `computed()`.
- `effect()` solo per side effect leggeri (sync input esterni); evita logica pesante.
- Two-way: `model()`; in CVA allinea in `writeValue` e chiama `onChange` / `onTouched`.

## Definizione `@Component`

Mantieni sempre quest'ordine:

1. `imports`
2. `selector`
3. `templateUrl`
4. `styleUrl` (se presente)
5. `changeDetection`
6. `providers` (se necessari)

```ts
@Component({
  imports: [TailwindIcon],
  selector: 'tailwind-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
```

## Form (ControlValueAccessor)

Se il componente è usabile in form (`formControl`, `ngModel`):

- `implements ControlValueAccessor` + provider `NG_VALUE_ACCESSOR` con `forwardRef`.
- `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState` (pattern `isDisabled = signal(false)`).
- Esempi: `input`, `checkbox`, `select`, `toggle`, `textarea`.

## Template

- Logica nel `.ts`; template dichiarativo con `@if` / `@for` / `@switch`.
- Componenti compositi: riusa il design system (`tailwind-select`, `tailwind-button`, …), non HTML nativo duplicato.
- Esempio: `tailwind-pagination` usa `tailwind-select`, non `<select>`.

## Accessibilità (obbligatorio)

Ogni componente deve rispettare **WCAG 2.1 livello AA** e le [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) per il pattern che implementa. L'accessibilità non è opzionale: va progettata insieme all'API e al template, non aggiunta dopo.

### Semantica e HTML nativo

- Preferisci elementi nativi con comportamento built-in (`<button>`, `<input>`, `<label>`, `<nav>`, …) invece di `<div>` cliccabili.
- `type="button"` sui pulsanti che non inviano form; non usare `href="#"` al posto di un button.
- Contenuto solo icona: **obbligatorio** un nome accessibile (`ariaLabel` input → `[attr.aria-label]`), come in `tailwind-button` / `tailwind-chip`.
- Icone e separatori puramente decorativi: `aria-hidden="true"` (es. `tailwind-icon`, separatori OTP).

### Campi form e CVA

Pattern condiviso (riferimento: `input/`, `select/`, `autocomplete/`):

| Requisito               | Implementazione                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| Etichetta visibile      | `<label [attr.for]="id() ? id() + '-inner' : null">`                                                      |
| Controllo               | `[attr.id]="id() ? id() + '-inner' : null"`                                                               |
| Errore                  | `hasError()` + `errorText()`; `[attr.aria-invalid]` solo quando `hasError()` è true                       |
| Testo di aiuto / errore | `[attr.id]="id() ? id() + '-helper' : null"` + `[attr.aria-describedby]="…"` sul controllo                |
| Disabilitato            | attributo `disabled` / `isDisabled()`; per stati solo lettura usa `readonly` o `aria-readonly` dove serve |

### Widget compositi (ARIA)

Se il componente non è un controllo form "semplice", applica il **ruolo e gli attributi ARIA** del pattern APG corrispondente e collegali tra loro:

| Pattern                   | Esempi nel repo            | Attributi / ruoli tipici                                                                                                                                      |
| ------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Combobox + listbox        | `select`, `autocomplete`   | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, `role="listbox"` / `role="option"`, `aria-selected`, `aria-disabled` su opzioni |
| Tab                       | `tab-group`                | `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, pannelli con `role="tabpanel"`                                                              |
| Dialog                    | `modal`                    | `role="dialog"`, `aria-modal="true"`, chiusura con Escape, pulsante chiudi con `ariaLabel`                                                                    |
| Gruppi                    | `input-otp`, `radio-group` | `role="group"` + `aria-label` / etichetta visibile                                                                                                            |
| Editor / superfici custom | `editor`                   | `role="textbox"`, `aria-multiline`, `aria-labelledby` / `aria-label`, stati `aria-readonly` / `aria-disabled`                                                 |

Esporre `ariaLabel` (e, se serve, label i18n dedicate in `models/` o `util/`) per testi che l'app deve tradurre — vedi `editor-labels.interface.ts`.

### Tastiera e focus

- **Tutti** i controlli interattivi devono essere raggiungibili e azionabili da tastiera (Tab, Shift+Tab).
- Widget custom: implementa `keydown` nel `.ts` secondo l'APG (frecce, Enter, Space, Escape, Tab per chiudere overlay). Riferimento: `select.component.ts` (`onKeydown`).
- Non rimuovere l'outline di focus senza sostituirlo con stili visibili coerenti col design system (`focus-visible:…`).
- Overlay (modal, drawer, menu, pannello): gestisci Escape; dove serve, focus iniziale sul pannello (`tabindex="-1"`) e ritorno focus all'apertura/chiusura.
- Input file o controlli "nascosti" visivamente: classe `sr-only`, `tabindex="-1"` se il focus deve andare altrove, ma mantieni `aria-label`.

### Stato, contrasto, movimento

- Stato non comunicato solo dal colore: usa testo, `aria-invalid`, `aria-selected`, `aria-current`, ecc.
- Rispetta i token colore del design system per contrasto sufficiente.
- Evita animazioni che non rispettino `prefers-reduced-motion` se aggiungi motion custom (oltre a quello già in Tailwind/theme).

## Test Vitest (obbligatorio)

Dopo creazione o modifica significativa: crea/aggiorna `<nome>.component.spec.ts` seguendo la skill **`generate-vitest-test`**.

Nello spec verifica almeno gli attributi e i ruoli esposti nel template (non solo `should create`). Esempi nel repo: `button.component.spec.ts` (`aria-label`, `role`), `tab-group.component.spec.ts` (`aria-selected`), `avatar.component.spec.ts`.

Esecuzione con **un comando secco**:

```
npx ng test angular-tailwind-components --include='src/lib/components/<folder>/<nome>.component.spec.ts' --watch=false
```

## Checklist componente

- [ ] Root cartella: solo `*.component.*` + sottocartelle (`properties/`, `interfaces/`, `util/`, …)
- [ ] Nessuna `const` / `type` / funzione a livello di modulo nel `.component.ts`
- [ ] Commenti sintetici (JSDoc di una riga)
- [ ] Signals
- [ ] CVA se form-compatible
- [ ] Template pulito con componenti DS
- [ ] **Accessibilità**: semantica nativa, label/id/aria-describedby/aria-invalid sui form, ARIA APG sui widget, tastiera, focus, `ariaLabel` su controlli solo icona, testi i18n per stringhe ARIA esposte
- [ ] Spec Vitest verde (inclusi test su `role` / `aria-*` dove applicabile)
- [ ] Storybook + Docs aggiornati; addon a11y senza violazioni bloccanti sulla story principale

---

# Storybook

Ambito: ogni aggiunta o modifica in `projects/angular-tailwind-components/src/lib/components/**/*.ts`

## Nuovi componenti

1. **Storybook**: crea `storybook/components/<name>/<name>.stories.ts` con almeno una story principale e controlli sugli input rilevanti.
2. **Documentazione**: crea `storybook/components/<name>/Docs.mdx` seguendo la struttura descritta sotto (riferimento: `badge`, `select`, `card`).
3. Registra il componente in `projects/angular-tailwind-components/.storybook/preview.ts` (`ALL_COMPONENTS`) se non è già importabile globalmente nelle stories.
4. Aggiorna `storybook/Introduction.mdx` e i **README** alla radice del repo e in `projects/angular-tailwind-components/` (conteggio componenti e voce in elenco) quando introduci un componente esposto pubblicamente.

## Struttura di `Docs.mdx`

Le pagine di documentazione sono **in inglese** e seguono sempre quest'ordine: identità → import → API → esempi.

| Sezione         | Contenuto                                                                      |
| --------------- | ------------------------------------------------------------------------------ |
| `# <Nome>`      | Titolo e una riga di descrizione della classe                                  |
| `## Import`     | Import dal package: `import { TailwindX } from 'angular-tailwind-components';` |
| `## Properties` | `<ArgTypes of={XStories} />` — **generato**, mai una tabella a mano            |
| `## Example`    | `<Canvas of={XStories.<PrimaryStory>} />` più lo snippet `@Component`          |
| Altre sezioni   | Varianti, stati, note: solo dove servono davvero                               |

`<ArgTypes>` legge `documentation.json`, generato da compodoc: input, output, `model()`, tipi, default, flag required e JSDoc di ogni proprietà, inclusi `id` / `class` ereditati da `TailwindComponent`. Di conseguenza:

- La **fonte di verità della documentazione API è il JSDoc** nel `.component.ts`: una riga, in inglese, su ogni `input()` / `output()` / `model()`. Senza JSDoc la colonna Description resta vuota nella pagina pubblica.
- `documentation.json` è rigenerato dai target Storybook (`compodoc: true` in `angular.json`) oppure a mano con `npm run docs:json`. È in `.gitignore`.
- I default risolti via token DI (`input(this.defaultSize ?? 'md')`) sono normalizzati in `.storybook/compodoc.ts`: si estende quello, non si scrive il valore nella pagina.

## Modifica componenti

1. **Storybook**: cerca `storybook/components/<name>/<name>.stories.ts` e aggiorna proprietà, valori o qualsiasi cosa sia stata modificata.
2. **Documentazione**: aggiorna `storybook/components/<name>/Docs.mdx` con le modifiche effettuate al componente. La tabella delle proprietà non si tocca: è generata dal JSDoc del componente.

Dopo modifiche rilevanti, controlla il pannello **Accessibility** (`@storybook/addon-a11y`) sulla story principale e correggi le violazioni automatiche o manuali.

## Story di varianti: disabilita i controls

Quando una story serve solo a **mostrare varianti** (dimensioni, colori, stati, griglie, demo reactive form, cataloghi, ecc.) con template **statico** o senza legare gli `args` al template (`argsToTemplate`, `props: args`), i controlli Storybook **non hanno effetto** sul canvas.

In quel caso aggiungi sempre:

```typescript
parameters: {
  controls: {
    disable: true;
  }
}
```

sulla singola story (non sul `meta` globale, così la story principale resta interattiva).

**Applica** quando, ad esempio:

- `render: () => ({ template: `...` })` con valori hardcoded (es. riga di `size="xs"` … `size="xl"`);
- più istanze del componente con `color` / `status` / utility `text-*` diversi nella stessa story;
- demo integrazione (form control, i18n, disabled) senza binding agli `args` della story.

**Non applicare** quando la story usa `args` + `props: args` / `argsToTemplate(args)` (o il render di default del `component` con `args`): lì i controls devono restare attivi.

## Story interattive: escludi controlli inutili

Quando una story è interattiva (`args` legati al canvas) ma **non usa** alcune proprietà nel suo scenario (es. `orientation` senza `label` nello spinner, `icon` su un button solo testo, `minDate`/`maxDate` sul datepicker base), nascondi i controlli irrilevanti **solo su quella story**:

```typescript
parameters: {
  controls: {
    exclude: ['orientation', 'label'];
  }
}
```

Non disabilitare tutti i controls (`disable: true`) se la story resta giocabile: usa `exclude` per il sottoinsieme inutile. Le story di varianti statiche restano con `disable: true`.

Esempi nel repo: `spinner.stories.ts` (Spinner vs WithLabel), `button.stories.ts` (Button vs IconOnly), `avatar.stories.ts` (Avatar vs WithImage).

Esempi `disable: true`: `avatar.stories.ts` (Dimensioni, Status), `icon.stories.ts` (Dimensioni, Colori), `chip.stories.ts` (Colori), `message.stories.ts` (Message), `calendar-panel.stories.ts` (WithReactiveForm).
