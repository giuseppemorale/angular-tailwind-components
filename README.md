# Angular Tailwind Components

A comprehensive Angular component library built entirely with **Tailwind CSS v4** — zero additional UI dependencies.

## Features

- 🎨 **35 components** — Buttons, Inputs, Modals, Tables, DatePickers, and more
- 🎯 **Pure Tailwind CSS** — No Angular Material, Ng-Zorro, or other UI frameworks
- ⚡ **Angular 21** — Signals, standalone components, modern control flow
- 📝 **ControlValueAccessor** — Full reactive forms integration for all form components
- ♿ **Accessible** — WCAG-compliant with proper ARIA roles and keyboard support
- 🧪 **Tested** — Unit tests with Vitest
- 📖 **Storybook** — Visual documentation for all components
- 🎭 **Customizable** — Runtime semantic colors with **`defineTheme()`**; optional CSS overrides via `@theme`

## Installation

```bash
npm install angular-tailwind-components
```

### Prerequisites

Your consuming project must have **Tailwind CSS v4** configured. Add the library stylesheet (it includes `@import "tailwindcss"`, design tokens, and **`@source` paths** so utilities used inside library components are generated without extra setup):

```css
@import 'angular-tailwind-components/styles/tailwind.css';
```

The published `styles/tailwind.css` scans the sibling `fesm2022` bundle plus library `.html` / `.ts` sources for development. You do **not** need a separate `@source` to `node_modules/.../fesm2022` in the consumer.

The same import also pulls in:
@import 'tailwindcss';

So you don't need to import the base styles

## Quick Start

```typescript
import { Component } from '@angular/core';
import { TailwindButton, TailwindInput, TailwindTextarea, TailwindToggle } from 'angular-tailwind-components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TailwindButton, TailwindInput, TailwindTextarea, TailwindToggle],
  template: `
    <tailwind-input label="Email" placeholder="you@example.com" [(value)]="email" />
    <tailwind-textarea label="Notes" placeholder="Optional notes" [(value)]="notes" />
    <tailwind-toggle label="Notifications" [(checked)]="notifications" />
    <tailwind-button variant="primary" (onClick)="submit()">Submit</tailwind-button>
  `
})
export class ExampleComponent {
  email = '';
  notes = '';
  notifications = true;
  submit() {
    /* ... */
  }
}
```

## Application configuration

Register shared defaults for library injection tokens with **`provideTailwindComponents`**. Each property is optional; only set keys produce `Provider` entries (same effect as individual `{ provide: TAILWIND_…, useValue: … }`). The function returns **`EnvironmentProviders`** (`makeEnvironmentProviders`), so you add it as **one** entry in `providers` without the spread operator.

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideTailwindComponents } from 'angular-tailwind-components';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTailwindComponents({
      iconSize: 20,
      datetimeLanguage: 'it',
      componentsSize: 'md',
      paginationSummary: 'Visualizzati {start}-{end} di {total}'
    })
  ]
};
```

| Config key | Token |
| --- | --- |
| `iconSize` | `TAILWIND_ICON_SIZE` |
| `datetimeLanguage` | `TAILWIND_DATETIME_LANGUAGE` |
| `componentsSize` | `TAILWIND_COMPONENTS_SIZE` |
| `paginationSummary` | `TAILWIND_PAGINATION_SUMMARY` |
| `modalData` | `TAILWIND_MODAL_DATA` (rare at app scope; modal `open()` still supplies per-dialog data) |

## Theme colors (`defineTheme`)

Use **`defineTheme`** from `angular-tailwind-components` to remap semantic design tokens (`primary`, `neutral`, `success`, `warning`, `danger`, `info`) at **runtime** on `document.documentElement`. It sets the same CSS custom properties as the library `@theme` block (for example `--color-primary-500`), so classes like `bg-primary-600` update without changing templates. The function returns **`EnvironmentProviders`**: add it as a single entry in `providers` (no spread), like `provideTailwindComponents`.

```typescript
import { ApplicationConfig } from '@angular/core';
import { defineTheme, provideTailwindComponents } from 'angular-tailwind-components';

export const appConfig: ApplicationConfig = {
  providers: [
    defineTheme({
      colors: {
        primary: 'violet',
        danger: 'rose',
        neutral: 'zinc'
      }
    }),
    provideTailwindComponents({
      iconSize: 20,
      datetimeLanguage: 'it',
      componentsSize: 'md'
    })
  ]
};
```

| `colors` key | CSS variables | Default palette in `tailwind.css` |
| --- | --- | --- |
| `primary` | `--color-primary-*` | Tailwind `blue` |
| `neutral` | `--color-neutral-*` | Tailwind `slate` |
| `success` | `--color-success-*` | Tailwind `green` |
| `warning` | `--color-warning-*` | Tailwind `amber` |
| `danger` | `--color-danger-*` | Tailwind `red` |
| `error` | Same as `danger` if `danger` is omitted | — |
| `info` | `--color-info-*` | Tailwind `sky` |

### `TailwindThemeSeverityColor`

Each `colors.*` field uses the exported type **`TailwindThemeSeverityColor`**. It can be either of the following:

1. **A string — Tailwind palette name**  
   Use the lowercase **family name** only (the segment between the utility prefix and the shade), e.g. `bg-indigo-600` → `'indigo'`, `text-slate-500` → `'slate'`.  
   The full list of built-in names and swatches is in the official **[Tailwind CSS color reference](https://tailwindcss.com/docs/colors)** — pick any name from that page for the string form.  
   For each configured shade, `defineTheme` sets `--color-<semantic>-<shade>` to `var(--color-<that-name>-<shade>)`.

2. **A partial object — per-shade CSS**  
   Keys are optional shade steps: `'50'`, `'100'`, …, `'950'`. Values are any valid CSS color (`#hex`, `rgb()`, `oklch()`, `var(--color-fuchsia-600)`, etc.). Only the keys you pass are overridden.

   When you use a **string**, shade coverage matches the library tokens: `primary` and `neutral` include `950`; `success`, `warning`, `danger`, and `info` stop at `900`.

When you pass a **palette string** (e.g. `primary: 'indigo'`), the target variables `--color-indigo-*` must exist in the compiled CSS. Tailwind v4 only emits palette variables that are referenced at build time, so the library’s `tailwind.css` **safelists** the default Tailwind families (`slate`, `gray`, `indigo`, …) with `@source inline(...)`. For a custom family name not covered there, use the object form with explicit colors, or add your own `@source inline("bg-<name>-{50,{100..900..100},950}")` in your app stylesheet.

`defineTheme` is a no-op during **SSR** (browser only).

## Content slots

Some components (for example `tailwind-card`, `tailwind-modal`, `tailwind-toolbar`, `tailwind-drawer`, `tailwind-notification`) support **named slots** via **attribute selectors** on native elements, matching `ng-content select="[…]"` in the library. Example: `<div tailwind-card-header>…</div>`, `<div tailwind-modal-content>…</div>`. Optional helper components for modal (`TailwindModalTitle`, and so on) use the same attribute on the host.

## Components

### Form Controls (with ControlValueAccessor)

- **Input** (`tailwind-input`): Text, email, password, number, search
- **Textarea** (`tailwind-textarea`): Multi-line text with resize modes and rows/cols
- **Upload** (`tailwind-upload`): File picker as button or drop zone; value as base64 data URL for forms, `filesSelected` for raw files
- **Input OTP** (`tailwind-input-otp`): Multi-digit OTP / PIN with paste and keyboard navigation
- **Checkbox** (`tailwind-checkbox`): Single checkbox with label
- **Radio Group** (`tailwind-radio-group`): Radio button group with options
- **Select** (`tailwind-select`): Native select with custom styling
- **Toggle** (`tailwind-toggle`): Switch on/off
- **DatePicker** (`tailwind-date-picker`): Calendar date selection
- **TimePicker** (`tailwind-time-picker`): Time input
- **DateTimePicker** (`tailwind-datetime-picker`): Combined date + time

### Display

- **Button** (`tailwind-button`): Primary, secondary, outline, ghost, danger
- **Badge** (`tailwind-badge`): Status badges with dot indicator
- **Card** (`tailwind-card`): Content card with header/body/footer
- **Chip** (`tailwind-chip`): Removable tags
- **Tag** (`tailwind-tag`): Semantic labels
- **Title** (`tailwind-title`): Semantic headings (`h1`–`h6`) with required `text` and optional Heroicons outline icon

### Feedback

- **Alert** (`tailwind-alert`): Contextual alerts (info, success, warning, danger)
- **Spinner** (`tailwind-spinner`): Loading indicator
- **Progress Bar** (`tailwind-progress-bar`): Determinate/indeterminate progress
- **Toast** (`tailwind-toast-container`): Global toast notifications (use `TailwindToastService`)
- **Notification** (`tailwind-notification`): Inline notification with actions
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

## Design System

The library uses a comprehensive design system defined via Tailwind CSS v4 `@theme` directive:

- **Colors**: Semantic tokens alias Tailwind default palettes — Primary (`blue`), neutral (`slate`), Success (`green`), Warning (`amber`), Danger (`red`), Info (`sky`)
- **Typography**: Inter (sans), JetBrains Mono (mono)
- **Spacing**: Tailwind default scale
- **Border Radius**: xs through full
- **Shadows**: xs through 2xl
- **Z-Index**: Defined scale for overlays (dropdown → tooltip → toast)

### Customization

Prefer **`defineTheme({ colors: { … } })`** in `ApplicationConfig.providers` for semantic colors (see [Theme colors](#theme-colors-definetheme)).

You can still override any token in your own CSS, for example:

```css
@theme {
  --color-primary-500: var(--color-violet-500);
  --color-primary-600: var(--color-violet-600);
}
```

## Development

```bash
# Build the library
ng build angular-tailwind-components

# Start Storybook
npm run storybook
```

### Component Conventions

- Use `input()` and `output()` signal functions (not decorators)
- Use `model()` for two-way binding
- Use `computed()` for derived Tailwind class logic
- Implement `ControlValueAccessor` for form controls
- Follow WCAG accessibility guidelines

## License

MIT

The bundled **[Heroicons](https://heroicons.com/)** outline SVG icons are © [Tailwind Labs](https://tailwindcss.com/), licensed under the [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE).
