# Angular Tailwind Components

A comprehensive Angular component library built entirely with **Tailwind CSS v4** — zero additional UI dependencies.

**Live Storybook:** [angular-tailwind-components.vercel.app](https://angular-tailwind-components.vercel.app/)

## Features

- 🎨 **53 components** — Buttons, Inputs, Modals, Tables, DatePickers, and more
- 🎯 **Pure Tailwind CSS** — No third-party UI component frameworks
- ⚡ **Angular** — Signals, standalone components, modern control flow
- 📝 **ControlValueAccessor** — Full reactive forms integration for all form components
- ♿ **Accessible** — WCAG-compliant with proper ARIA roles and keyboard support
- 🧪 **Tested** — Unit tests with Vitest
- 📖 **Storybook** — [Visual documentation](https://angular-tailwind-components.vercel.app/) for all components
- 🎭 **Customizable** — **`provideTailwindConfig()`** for injection-token defaults and runtime semantic colors; optional CSS overrides via `@theme`

## Compatibility

### Versioning rule

The **library major matches the Angular major** in your app (library **21.x** → **Angular 21**, **22.x** → **Angular 22**, and so on).

### Which version should I use?

| Library  | Angular               | Tailwind CSS | Notes                                                 |
| :------- | :-------------------- | :----------- | :---------------------------------------------------- |
| **22.x** | 22                    | 4            | **Current.** Use on Angular 22 apps.                  |
| **21.x** | 21                    | 4            | Previous. Use on Angular 21 apps.                     |
| **23+**  | same major as Angular | 4            | Each new Angular major gets a matching library major. |

### Peer dependencies

Your app should use:

- **Angular** 22 — `@angular/core` and related packages `^22`
- **Tailwind CSS** 4 — `tailwindcss` `^4`
- **PostCSS** 8 — `postcss` `^8`

Exact ranges for the version you install are listed under [peerDependencies on npm](https://www.npmjs.com/package/angular-tailwind-components?activeTab=dependencies).

## Installation

```bash
npm install angular-tailwind-components
```

### Prerequisites

Install peer dependencies **Tailwind CSS v4** (`tailwindcss`, `postcss`) in your app.

Register the library stylesheet in **`angular.json`** under your application target (`architect.build.options.styles`). This is required so semantic tokens and utilities (`bg-primary-600`, `text-on-primary-*`, …) are emitted in the compiled CSS:

```json
"styles": [
  "node_modules/angular-tailwind-components/styles/tailwind.css",
  "src/styles.css"
]
```

That file already includes `@import "tailwindcss"`, the library `@theme` block (`primary`, `neutral`, `success`, …), and `@source` paths for classes used inside library components.

Do **not** use only `@import "tailwindcss"` in `src/styles.css` — it does not register semantic `primary` / `on-primary` tokens; primary buttons may look gray even when `provideTailwindThemeColors` is configured.

Keep `src/styles.css` for app-specific global rules (fonts, layout, etc.) only. You do **not** need a separate `@source` to `node_modules/.../fesm2022` in the consumer.

An `@import 'angular-tailwind-components/styles/tailwind.css'` inside a CSS file may fail to resolve library `@source` paths in some Angular builds; prefer the `node_modules/...` entry in `angular.json` above.

## Quick Start

```typescript
import { Component } from '@angular/core';
import { TailwindButton, TailwindInput, TailwindTextarea, TailwindToggle } from 'angular-tailwind-components';

@Component({
  selector: 'app-example',
  imports: [TailwindButton, TailwindInput, TailwindTextarea, TailwindToggle],
  template: `
    <form [formGroup]="form">
      <tailwind-input label="Email" placeholder="you@example.com" [formControl]="form.controls.email" />
      <tailwind-textarea label="Notes" placeholder="Optional notes" [formControl]="form.controls.notes" />
      <tailwind-toggle label="Notifications" [formControl]="form.controls.notifications" />
      <tailwind-button color="primary" (onClick)="submit()">Submit</tailwind-button>
    </form>
  `
})
export class ExampleComponent {
  form = new FormGroup({
    email: new FormControl(''),
    notes: new FormControl(''),
    notifications: new FormControl(false)
  });

  submit() {
    console.log(this.form.value);
  }
}
```

## Application configuration (`provideTailwindConfig`)

Use **`provideTailwindConfig`** to override library **injection tokens**. Pass a **factory** so you can use `inject()` (e.g. Transloco). For runtime semantic **`COLORS`**, add **`provideTailwindThemeColors`** separately.

### Example (tokens + colors)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTailwindConfig } from 'angular-tailwind-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTailwindConfig(() => ({
      ICON_SIZE: 20,
      DATETIME_LANGUAGE: 'it',
      COMPONENTS_SIZE: 'md',
      BUTTON_KIND: 'flat',
      PAGINATION_SUMMARY: 'Visualizzati {start}-{end} di {total}'
    })),
    provideTailwindThemeColors(() => ({
      primary: 'violet',
      danger: 'rose',
      neutral: 'zinc'
    }))
  ]
};
```

### Example: tokens only

```typescript
providers: [
  provideTailwindConfig(() => ({
    ICON_SIZE: 20,
    DATETIME_LANGUAGE: 'it',
    COMPONENTS_SIZE: 'md',
    PAGINATION_SUMMARY: 'Items {start}-{end} of {total}'
  }))
];
```

### Example: colors only

```typescript
providers: [provideTailwindThemeColors(() => ({ primary: 'indigo', neutral: 'zinc' }))];
```

### Example: spread a shared config object

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTailwindConfig, type TailwindComponentsConfig } from 'angular-tailwind-components';

const shared: TailwindComponentsConfig = {
  COMPONENTS_SIZE: 'md',
  DATETIME_LANGUAGE: 'it'
};

export const appConfig: ApplicationConfig = {
  providers: [provideTailwindConfig(() => shared), provideTailwindThemeColors(() => ({ primary: 'indigo' }))]
};
```

You can omit **`COLORS`** if you only need token defaults, or omit token keys if you only need theme colors.

| Config key           | Token                         | What it sets                                                           |
| -------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `ICON_SIZE`          | `TAILWIND_ICON_SIZE`          | Default `tailwind-icon` pixel size                                     |
| `ICON_BASE_PATH`     | `TAILWIND_ICON_BASE_PATH`     | Directory the icon SVGs are served from (see [Icons](#icons))          |
| `DATETIME_LANGUAGE`  | `TAILWIND_DATETIME_LANGUAGE`  | Calendar and time-picker language                                      |
| `COMPONENTS_SIZE`    | `TAILWIND_COMPONENTS_SIZE`    | Default `size` for every sized component                               |
| `BUTTON_KIND`        | `TAILWIND_BUTTON_KIND`        | Default `kind` for `tailwind-button`                                   |
| `PAGINATION_SUMMARY` | `TAILWIND_PAGINATION_SUMMARY` | Default pagination summary template                                    |
| `LABELS`             | `TAILWIND_LABELS`             | Accessible names and built-in text (see [Localization](#localization)) |
| `PASSWORD_LABELS`    | `TAILWIND_PASSWORD_LABELS`    | Password strength labels                                               |
| `EDITOR_LABELS`      | `TAILWIND_EDITOR_LABELS`      | Editor toolbar and dialog labels                                       |
| `TITLE_SCALE`        | `TAILWIND_TITLE_SCALE`        | Per-tag typography for `tailwind-title`                                |

> **`COMPONENTS_SIZE`** is honoured by every component with a `size` input except `tailwind-modal`, whose `size` is a dialog width rather than a control size.

**`provideTailwindComponents`** remains exported for backward compatibility (token providers only) but is **deprecated**; prefer **`provideTailwindConfig`**.

## Localization

Components that render text or accessible names on their own read them from **`TAILWIND_LABELS`**. Pass only the keys you want to translate; the rest fall back to the English defaults.

```typescript
provideTailwindConfig(() => ({
  LABELS: {
    close: 'Chiudi',
    dismiss: 'Ignora',
    previousPage: 'Pagina precedente',
    nextPage: 'Pagina successiva',
    rowsPerPage: 'Righe per pagina',
    search: 'Cerca',
    searchPlaceholder: 'Cerca…',
    noData: 'Nessun dato disponibile',
    noResults: 'Nessun risultato',
    page: 'Pagina {page}',
    currentPage: 'pagina corrente'
  }
}));
```

Because the factory runs through `inject()`, the values can come from a translation library:

```typescript
provideTailwindConfig(() => {
  const t = inject(TranslocoService);
  return { LABELS: { close: t.translate('common.close'), search: t.translate('common.search') } };
});
```

Every label also has a matching component input (`closeLabel` on modal and drawer, `searchLabel` on table, …) when a single instance needs a different string.

## Dark mode

Components paint themselves with surface tokens (`bg-surface`, `text-fg`, `border-border`) and the `neutral` ramp, so dark mode is a variable remap rather than a per-component variant. Turn it on by putting a class on `<html>`:

```html
<html class="dark">
  <!-- or data-theme="dark" -->
</html>
```

To follow the operating system instead, use `class="theme-auto"`. This is opt-in on purpose: upgrading the library never turns an existing app dark on its own.

```typescript
// Toggling at runtime
document.documentElement.classList.toggle('dark');
```

Dark mode composes with `provideTailwindThemeColors`: the dark rules are scoped to `:root.dark`, which outranks the `:root` variables injected for a custom brand palette.

## Icons

Icon SVGs ship in the package under `tailwind-icons/` and are loaded at runtime as CSS masks from `/tailwind-icons/<name>.svg`. Copy them into your served assets, and if the app is **not** served from the domain root, point the library at the right directory:

```typescript
provideTailwindConfig(() => ({ ICON_BASE_PATH: '/my-app/tailwind-icons' }));
```

## Theme colors (`provideTailwindThemeColors`)

The optional **`COLORS`** object remaps semantic design tokens (`primary`, `neutral`, `success`, `warning`, `danger`, `info`) at **runtime** using the same `--color-*` names as the library `@theme` block (for example `--color-primary-500`), so classes like `bg-primary-600` update without changing templates. Requires the library stylesheet in `angular.json` (see [Prerequisites](#prerequisites)) so those utilities exist in the compiled CSS. At startup, **`provideTailwindThemeColors`** sets `data-tailwind-theme` on `<html>` and injects `<style id="tailwind-theme-colors">` with the variables in `@layer theme` (`:root[data-tailwind-theme]` and `:host`). Color application is a **no-op during SSR** (browser only).

| `COLORS` key | CSS variables                               | Default palette in `tailwind.css` |
| ------------ | ------------------------------------------- | --------------------------------- |
| `primary`    | `--color-primary-*`, `--color-on-primary-*` | Tailwind `blue`                   |
| `neutral`    | `--color-neutral-*`, `--color-on-neutral-*` | Tailwind `slate`                  |
| `success`    | `--color-success-*`, `--color-on-success-*` | Tailwind `green`                  |
| `warning`    | `--color-warning-*`, `--color-on-warning-*` | Tailwind `amber`                  |
| `danger`     | `--color-danger-*`, `--color-on-danger-*`   | Tailwind `red`                    |
| `error`      | Same as `danger` if `danger` is omitted     | —                                 |
| `info`       | `--color-info-*`, `--color-on-info-*`       | Tailwind `sky`                    |

### `TailwindThemeSeverityColor`

Each `colors.*` field uses the exported type **`TailwindThemeSeverityColor`**. It can be any of the following:

1. **A string — Tailwind palette name**  
   Use the lowercase **family name** only (the segment between the utility prefix and the shade), e.g. `bg-indigo-600` → `'indigo'`, `text-slate-500` → `'slate'`.  
   The full list of built-in names and swatches is in the official **[Tailwind CSS color reference](https://tailwindcss.com/docs/colors)** — pick any name from that page for the string form.  
   For each configured shade, `provideTailwindThemeColors` sets `--color-<semantic>-<shade>` to `var(--color-<that-name>-<shade>)`.  
   **Foreground / contrast:** built-in components that sit on saturated semantic backgrounds (solid buttons, tags, semantic toolbar) use utilities like `text-on-success-600`, backed by **`--color-on-<semantic>-<shade>`** defaults in the library `@theme`. With a **palette string**, you usually do **not** need to set `on` yourself — Tailwind’s scales stay internally consistent.

2. **A partial object — per-shade CSS (legacy flat form)**  
   Keys are optional shade steps: `'50'`, `'100'`, …, `'950'`. Values are any valid CSS color (`#hex`, `rgb()`, `oklch()`, `var(--color-fuchsia-600)`, etc.). Only the keys you pass are written to `--color-<semantic>-<shade>`.  
   **Optional `on`:** if you override background shades with custom values, set matching foreground tokens by using the structured form below so text stays readable.

3. **A structured object — `{ shades, on? }`**
   - **`shades`**: same as the flat object: maps to `--color-<semantic>-<shade>`.
   - **`on`**: optional partial map of the same shade keys → CSS colors for **`--color-on-<semantic>-<shade>`** (recommended foreground on that semantic background). Solid `tailwind-button` / `tailwind-tag` / semantic `tailwind-toolbar` read these via `text-on-*` utilities.

   Example:

   ```typescript
   provideTailwindThemeColors(() => ({
     success: {
       shades: { 600: '#14532d', 700: '#0f3d21' },
       on: { 600: '#ecfdf5', 700: '#ecfdf5' }
     }
   }));
   ```

   When you use a **string**, shade coverage matches the library tokens: `primary` and `neutral` include `950`; `success`, `warning`, `danger`, and `info` stop at `900`.

When you pass a **palette string** (e.g. `primary: 'indigo'`), the target variables `--color-indigo-*` must exist in the compiled CSS. Tailwind v4 only emits palette variables that are referenced at build time, so the library’s `tailwind.css` **safelists** the default Tailwind families (`slate`, `gray`, `indigo`, …) with `@source inline(...)`. For a custom family name not covered there, use the object form with explicit colors, or add your own `@source inline("bg-<name>-{50,{100..900..100},950}")` in your app stylesheet.

`provideTailwindThemeColors` is a no-op during **SSR** (browser only).

## Content slots

Some components (for example `tailwind-card`, `tailwind-modal`, `tailwind-toolbar`, `tailwind-drawer`, `tailwind-alert`) support **named slots** via **attribute selectors** on native elements, matching `ng-content select="[…]"` in the library. Example: `<div tailwind-card-header>…</div>`, `<div tailwind-modal-content>…</div>`. Optional helper components for modal (`TailwindModalTitle`, and so on) use the same attribute on the host.

## Components

### Form Controls (with ControlValueAccessor)

- **Input** (`tailwind-input`): Text, email, password, number, search
- **Input Password** (`tailwind-input-password`): Password field with optional strength meter and show/hide toggle
- **Textarea** (`tailwind-textarea`): Multi-line text with resize modes and rows/cols
- **Editor** (`tailwind-editor`): WYSIWYG rich text; sanitized HTML value, toolbar, link/image insertion
- **Upload** (`tailwind-upload`): File picker as button or drop zone; value as base64 data URL for forms, `filesSelected` for raw files
- **Input OTP** (`tailwind-input-otp`): Multi-digit OTP / PIN with paste and keyboard navigation
- **Checkbox** (`tailwind-checkbox`): Single checkbox with label
- **Radio Group** (`tailwind-radio-group`): Radio button group with options
- **Select** (`tailwind-select`): Custom combobox with CDK overlay, keyboard navigation, and optional multi-select with removable chips
- **Autocomplete** (`tailwind-autocomplete`): Typeahead with optional async search and custom option template (`#item`)
- **Toggle** (`tailwind-toggle`): Switch on/off
- **Slider** (`tailwind-slider`): Single or range slider with optional ticks (`ControlValueAccessor`)
- **CalendarPanel** (`tailwind-calendar-panel`): Inline calendar for date selection
- **DatePicker** (`tailwind-date-picker`): Calendar date selection
- **TimePicker** (`tailwind-time-picker`): Time input
- **DateTimePicker** (`tailwind-datetime-picker`): Combined date + time
- **Segmented Control** (`tailwind-segmented-control`): Side-by-side exclusive choices, as an ARIA radio group
- **Number Input** (`tailwind-number-input`): Numeric field with real increment/decrement buttons, clamped to `min`/`max`
- **Rating** (`tailwind-rating`): Star rating exposed as a slider, editable or read-only

### Display

- **Button** (`tailwind-button`): Primary, secondary, outline, ghost, danger
- **Badge** (`tailwind-badge`): Status badges with dot indicator
- **Card** (`tailwind-card`): Content card with header/body/footer
- **Chip** (`tailwind-chip`): Removable compact labels for filters and multi-select
- **Tag** (`tailwind-tag`): Semantic labels
- **Avatar** (`tailwind-avatar`): Profile image, initials, or icon fallback with optional status dot (`TailwindColor`)
- **Title** (`tailwind-title`): Semantic headings (`h1`–`h6`) with required `text` and optional Heroicons outline icon
- **Kbd** (`tailwind-kbd`): Keyboard keys and chords, rendered as native `<kbd>`
- **Timeline** (`tailwind-timeline`, `tailwind-timeline-item`): Ordered sequence of events, rendered as an `<ol>`
- **Carousel** (`tailwind-carousel`, `tailwind-carousel-slide`): Slideshow with opt-in autoplay that pauses on hover and focus

### Feedback

- **Alert** (`tailwind-alert`): Contextual alerts with icon, title, dismiss, and optional `tailwind-alert-actions` slot
- **Spinner** (`tailwind-spinner`): Loading indicator
- **Progress Bar** (`tailwind-progress-bar`): Determinate/indeterminate progress
- **Empty State** (`tailwind-empty-state`): The "nothing here yet" panel, with icon, headline and room for a call to action
- **Toast** (`tailwind-toast-container`): Global toast notifications (use `TailwindToastService`)
- **Message** (`tailwind-message`): Form-level inline message
- **Skeleton** (`tailwind-skeleton`): Loading placeholder

### Navigation

- **Tab Group** (`tailwind-tab-group`): Tabbed content
- **Breadcrumb** (`tailwind-breadcrumb`): Navigation breadcrumbs
- **Pagination** (`tailwind-pagination`): Page navigation
- **Menu** (`tailwind-menu`): Dropdown menu
- **Stepper** (`tailwind-stepper`): Step-by-step wizard
- **Tree** (`tailwind-tree`): Hierarchical list following the ARIA tree pattern, with flattened rendering

### Layout / Overlay

- **Modal** (`tailwind-modal`): Dialog overlay
- **Drawer** (`tailwind-drawer`): Slide-in panel
- **Accordion** (`tailwind-accordion`): Expandable sections
- **Tooltip** (`tailwind-tooltip`): Hover tooltip
- **Popover** (`tailwind-popover`): Panel of arbitrary content anchored to a trigger, with viewport flipping
- **Popconfirm** (`tailwind-popconfirm`): Inline confirmation anchored to the control that triggered it
- **Form** (`tailwind-form`): Form wrapper
- **Table** (`tailwind-table`): Generic data table with projected header/rows, per-column comparators, sticky header, select-all, and either client-side or server-side sort/paging
- **Toolbar** (`tailwind-toolbar`): Semantic action bar with optional slots
- **Divider** (`tailwind-divider`): Horizontal or vertical separator with optional label
- **Meter** (`tailwind-meter`): Segmented proportional bar with optional legend

## Design System

The library uses a comprehensive design system defined via Tailwind CSS v4 `@theme` directive:

- **Colors**: Semantic tokens alias Tailwind default palettes — Primary (`blue`), neutral (`slate`), Success (`green`), Warning (`amber`), Danger (`red`), Info (`sky`)
- **Typography**: Inter (sans), JetBrains Mono (mono)
- **Spacing**: Tailwind default scale
- **Border Radius**: xs through full
- **Shadows**: xs through 2xl
- **Z-Index**: Defined scale for overlays (dropdown → tooltip → toast)

### Customization

Prefer **`provideTailwindConfig(() => ({ … }))`** in `ApplicationConfig.providers` for tokens and semantic colors (see [Application configuration](#application-configuration-providetailwindconfig)).

You can still override any token in your own CSS, for example:

```css
@theme {
  --color-primary-500: var(--color-violet-500);
  --color-primary-600: var(--color-violet-600);
}
```

## Development

Browse components in the hosted Storybook: [angular-tailwind-components.vercel.app](https://angular-tailwind-components.vercel.app/)

```bash
# Build the library
ng build angular-tailwind-components

# Start Storybook locally
npm run storybook

# Build static Storybook (output: storybook-static/)
npm run build:storybook
```

### Component Conventions

- Use `input()` and `output()` signal functions (not decorators)
- Use `model()` for two-way binding
- Use `computed()` for derived Tailwind class logic
- Implement `ControlValueAccessor` for form controls
- Follow WCAG accessibility guidelines

## Migrating from 22.x

The library is signals-first and its public API was aligned with the Angular style guide. The
changes below are mechanical; nothing needs restructuring.

### Outputs are no longer prefixed with `on`

An output is an event name, so the binding already reads as one. Rename the bindings:

| Before                                            | After                                                      |
| :------------------------------------------------ | :--------------------------------------------------------- |
| `(onClose)` on modal / drawer                     | `(closed)`                                                 |
| `(onDismiss)` on alert                            | `(dismissed)`                                              |
| `(onToggle)` on accordion item                    | `(toggled)`                                                |
| `(onSelect)` on menu                              | `(itemSelect)`                                             |
| `(onMenuSelect)` on toolbar                       | `(menuSelect)`                                             |
| `(onSearch)` on autocomplete                      | `(searchChange)`                                           |
| `(onSortChange)` / `(onSelectionChange)` on table | `(sortChange)` / `(selectionChange)`                       |
| `(onPageChange)` on pagination and table          | `(pageChange)`                                             |
| `(onPageSizeChange)` on pagination                | `(pageSizeChange)` — now the `pageSize` model's own output |

### `tailwind-button` has no `onClick` output

The inner `<button>`'s native click already bubbles to the host, and a disabled button emits
nothing, so bind the native event instead:

```html
<!-- before -->
<tailwind-button (onClick)="save()">Save</tailwind-button>
<!-- after -->
<tailwind-button (click)="save()">Save</tailwind-button>
```

The button also no longer writes `role="button"` on the native element, which already has that role.
Set `role` only to repurpose the control (`menuitem`, `tab`, `switch`, …).

### `hasError` derives itself from the form control

`tailwind-input` now reads the bound `NgControl` and paints the error state once the control is
invalid **and** touched or dirty. Passing `[hasError]` still forces the state, so existing code keeps
working — it is simply no longer necessary.

### Dates accept any locale

`DATETIME_LANGUAGE` was `'it' | 'en'` and is now any BCP 47 tag, defaulting to Angular's
`LOCALE_ID`. Month and weekday names come from `Intl`, and the calendar grid starts on the day the
locale prescribes rather than always on Monday.

### Overlays render in the CDK overlay container

Modal, drawer, menu, tooltip, popover and popconfirm now portal their panel into
`.cdk-overlay-container` instead of rendering in place. Tests and styles that reached into the
component's own DOM for those panels need to query the overlay container instead.

`styles/tailwind.css` pulls in the CDK overlay and a11y stylesheets itself, so nothing has to be
added to `angular.json`. Overlay panels are positioned by those rules — without them every panel
would lay out at the top of the page instead of next to its trigger.

## License

This project is licensed under the **Angular Tailwind Components License 1.0 (ATC-1.0)**. See the [LICENSE](https://github.com/giuseppemorale/angular-tailwind-components/blob/master/LICENSE) file for the full text.

- You may use the library in applications and **sell those applications** (including commercial and enterprise use).
- You may **not** sell or distribute the library itself (or a substantial repackaging of it) as a standalone UI/component library product.

**Third-party assets** bundled with this project keep their original licenses and are not covered by ATC-1.0. In particular, the bundled **[Heroicons](https://heroicons.com/)** outline SVG icons are © [Tailwind Labs](https://tailwindcss.com/), licensed under the [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE).
