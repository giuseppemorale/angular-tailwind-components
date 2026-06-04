# Angular Tailwind Components

A comprehensive Angular component library built entirely with **Tailwind CSS v4** — zero additional UI dependencies.

**Live Storybook:** [angular-tailwind-components.vercel.app](https://angular-tailwind-components.vercel.app/)

## Features

- 🎨 **43 components** — Buttons, Inputs, Modals, Tables, DatePickers, and more
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

| Library | Angular | Tailwind CSS | Notes |
| :------ | :------ | :----------- | :---- |
| **21.x** | 21 | 4 | **Current.** Use on Angular 21 apps. |
| **22.x** | 22 | 4 | Planned — when Angular 22 is supported and tested. |
| **23+** | same major as Angular | 4 | Each new Angular major gets a matching library major. |

### Peer dependencies

Your app should use:

- **Angular** 21 — `@angular/core` and related packages `^21`
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
      PAGINATION_SUMMARY: 'Visualizzati {start}-{end} di {total}',
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
  providers: [
    provideTailwindConfig(() => shared),
    provideTailwindThemeColors(() => ({ primary: 'indigo' }))
  ]
};
```

You can omit **`COLORS`** if you only need token defaults, or omit token keys if you only need theme colors.

| Config key | Token |
| --- | --- |
| `ICON_SIZE` | `TAILWIND_ICON_SIZE` |
| `DATETIME_LANGUAGE` | `TAILWIND_DATETIME_LANGUAGE` |
| `COMPONENTS_SIZE` | `TAILWIND_COMPONENTS_SIZE` |
| `BUTTON_KIND` | `TAILWIND_BUTTON_KIND` |
| `PAGINATION_SUMMARY` | `TAILWIND_PAGINATION_SUMMARY` |
| `PASSWORD_LABELS` | `TAILWIND_PASSWORD_LABELS` |
| `EDITOR_LABELS` | `TAILWIND_EDITOR_LABELS` |
| `TITLE_SCALE` | `TAILWIND_TITLE_SCALE` |

**`provideTailwindComponents`** remains exported for backward compatibility (token providers only) but is **deprecated**; prefer **`provideTailwindConfig`**.

## Theme colors (`provideTailwindThemeColors`)

The optional **`COLORS`** object remaps semantic design tokens (`primary`, `neutral`, `success`, `warning`, `danger`, `info`) at **runtime** using the same `--color-*` names as the library `@theme` block (for example `--color-primary-500`), so classes like `bg-primary-600` update without changing templates. Requires the library stylesheet in `angular.json` (see [Prerequisites](#prerequisites)) so those utilities exist in the compiled CSS. At startup, **`provideTailwindThemeColors`** sets `data-tailwind-theme` on `<html>` and injects `<style id="tailwind-theme-colors">` with the variables in `@layer theme` (`:root[data-tailwind-theme]` and `:host`). Color application is a **no-op during SSR** (browser only).

| `COLORS` key | CSS variables | Default palette in `tailwind.css` |
| --- | --- | --- |
| `primary` | `--color-primary-*`, `--color-on-primary-*` | Tailwind `blue` |
| `neutral` | `--color-neutral-*`, `--color-on-neutral-*` | Tailwind `slate` |
| `success` | `--color-success-*`, `--color-on-success-*` | Tailwind `green` |
| `warning` | `--color-warning-*`, `--color-on-warning-*` | Tailwind `amber` |
| `danger` | `--color-danger-*`, `--color-on-danger-*` | Tailwind `red` |
| `error` | Same as `danger` if `danger` is omitted | — |
| `info` | `--color-info-*`, `--color-on-info-*` | Tailwind `sky` |

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

### Display

- **Button** (`tailwind-button`): Primary, secondary, outline, ghost, danger
- **Badge** (`tailwind-badge`): Status badges with dot indicator
- **Card** (`tailwind-card`): Content card with header/body/footer
- **Chip** (`tailwind-chip`): Removable compact labels for filters and multi-select
- **Tag** (`tailwind-tag`): Semantic labels
- **Avatar** (`tailwind-avatar`): Profile image, initials, or icon fallback with optional status dot (`TailwindColor`)
- **Title** (`tailwind-title`): Semantic headings (`h1`–`h6`) with required `text` and optional Heroicons outline icon

### Feedback

- **Alert** (`tailwind-alert`): Contextual alerts with icon, title, dismiss, and optional `tailwind-alert-actions` slot
- **Spinner** (`tailwind-spinner`): Loading indicator
- **Progress Bar** (`tailwind-progress-bar`): Determinate/indeterminate progress
- **Toast** (`tailwind-toast-container`): Global toast notifications (use `TailwindToastService`)
- **Message** (`tailwind-message`): Form-level inline message
- **Skeleton** (`tailwind-skeleton`): Loading placeholder

### Navigation

- **Tab Group** (`tailwind-tab-group`): Tabbed content
- **Breadcrumb** (`tailwind-breadcrumb`): Navigation breadcrumbs
- **Pagination** (`tailwind-pagination`): Page navigation
- **Menu** (`tailwind-menu`): Dropdown menu
- **Stepper** (`tailwind-stepper`): Step-by-step wizard

### Layout / Overlay

- **Modal** (`tailwind-modal`): Dialog overlay
- **Drawer** (`tailwind-drawer`): Slide-in panel
- **Accordion** (`tailwind-accordion`): Expandable sections
- **Tooltip** (`tailwind-tooltip`): Hover tooltip
- **Form** (`tailwind-form`): Form wrapper
- **Table** (`tailwind-table`): Data table with projected header/rows, client-side sort and pagination
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

## License

This project is licensed under the **Angular Tailwind Components License 1.0 (ATC-1.0)**. See the [LICENSE](https://github.com/giuseppemorale/angular-tailwind-components/blob/master/LICENSE) file for the full text.

- You may use the library in applications and **sell those applications** (including commercial and enterprise use).
- You may **not** sell or distribute the library itself (or a substantial repackaging of it) as a standalone UI/component library product.

**Third-party assets** bundled with this project keep their original licenses and are not covered by ATC-1.0. In particular, the bundled **[Heroicons](https://heroicons.com/)** outline SVG icons are © [Tailwind Labs](https://tailwindcss.com/), licensed under the [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE).
