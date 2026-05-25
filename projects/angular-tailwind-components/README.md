# Angular Tailwind Components

A comprehensive Angular component library built entirely with **Tailwind CSS v4** — zero additional UI dependencies.

**Live Storybook:** [angular-tailwind-components.vercel.app](https://angular-tailwind-components.vercel.app/)

## Features

- 🎨 **37 components** — Buttons, Inputs, Modals, Tables, DatePickers, and more
- 🎯 **Pure Tailwind CSS** — No Angular Material, Ng-Zorro, or other UI frameworks
- ⚡ **Angular 21** — Signals, standalone components, modern control flow
- 📝 **ControlValueAccessor** — Full reactive forms integration for all form components
- ♿ **Accessible** — WCAG-compliant with proper ARIA roles and keyboard support
- 🧪 **Tested** — Unit tests with Vitest
- 📖 **Storybook** — [Visual documentation](https://angular-tailwind-components.vercel.app/) for all components
- 🎭 **Customizable** — **`defineTheme()`** for injection-token defaults; per-component **`color`** uses any [Tailwind palette](https://tailwindcss.com/docs/colors) (default `neutral`)

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
  imports: [TailwindButton, TailwindInput, TailwindTextarea, TailwindToggle],
  template: `
  <form [formGroup]="form">
    <tailwind-input label="Email" placeholder="you@example.com" [formControl]="form.controls.email" />
    <tailwind-textarea label="Notes" placeholder="Optional notes" [formControl]="form.controls.notes" />
    <tailwind-toggle label="Notifications" [formControl]="form.controls.notifications" />
    <tailwind-button color="neutral" (onClick)="submit()">Submit</tailwind-button>
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

## Application configuration (`defineTheme`)

Use **`defineTheme`** from `angular-tailwind-components` as the single app-level entry: it registers **`EnvironmentProviders`** for optional **injection tokens** (`iconSize`, `datetimeLanguage`, `componentsSize`, `buttonKind`, `paginationSummary`, `passwordLabels`, `titleScale`). Add **one** entry to `providers` without spreading.

### Example

```typescript
import { ApplicationConfig } from '@angular/core';
import { defineTheme } from 'angular-tailwind-components';

export const appConfig: ApplicationConfig = {
  providers: [
    defineTheme({
      iconSize: 20,
      datetimeLanguage: 'it',
      componentsSize: 'md',
      buttonKind: 'flat',
      paginationSummary: 'Visualizzati {start}-{end} di {total}'
    })
  ]
};
```

Brand and accent colors are set per component with the **`color`** input (`TailwindPalette`: `blue`, `indigo`, `emerald`, …). Default is **`neutral`** when omitted.

| Config key | Token |
| --- | --- |
| `iconSize` | `TAILWIND_ICON_SIZE` |
| `datetimeLanguage` | `TAILWIND_DATETIME_LANGUAGE` |
| `componentsSize` | `TAILWIND_COMPONENTS_SIZE` |
| `buttonKind` | `TAILWIND_BUTTON_KIND` |
| `paginationSummary` | `TAILWIND_PAGINATION_SUMMARY` |
| `passwordLabels` | `TAILWIND_PASSWORD_LABELS` |

**`provideTailwindComponents`** is still exported for backward compatibility (token providers only, same implementation as the token slice of `defineTheme`). It is **deprecated**; prefer **`defineTheme`**.

## Component colors (`TailwindPalette`)

Colorable components expose **`color`** with one of the 22 built-in Tailwind families (`slate`, `gray`, …, `rose`). Export **`TAILWIND_PALETTES`** for Storybook controls and validators. Default is **`neutral`**.

Migration from older API:

| Before | After |
| --- | --- |
| `color="primary"` | `color="blue"` (or your brand palette) |
| `severity="success"` on alert | `color="green"` |
| `defineTheme({ colors: { primary: 'indigo' } })` | `color="indigo"` on each component |

## Content slots

Some components (for example `tailwind-card`, `tailwind-modal`, `tailwind-toolbar`, `tailwind-drawer`, `tailwind-notification`) support **named slots** via **attribute selectors** on native elements, matching `ng-content select="[…]"` in the library. Example: `<div tailwind-card-header>…</div>`, `<div tailwind-modal-content>…</div>`. Optional helper components for modal (`TailwindModalTitle`, and so on) use the same attribute on the host.

## Components

### Form Controls (with ControlValueAccessor)

- **Input** (`tailwind-input`): Text, email, password, number, search
- **Input Password** (`tailwind-input-password`): Password field with optional strength meter and show/hide toggle
- **Textarea** (`tailwind-textarea`): Multi-line text with resize modes and rows/cols
- **Upload** (`tailwind-upload`): File picker as button or drop zone; value as base64 data URL for forms, `filesSelected` for raw files
- **Input OTP** (`tailwind-input-otp`): Multi-digit OTP / PIN with paste and keyboard navigation
- **Checkbox** (`tailwind-checkbox`): Single checkbox with label
- **Radio Group** (`tailwind-radio-group`): Radio button group with options
- **Select** (`tailwind-select`): Native select with custom styling
- **Autocomplete** (`tailwind-autocomplete`): Typeahead with optional async search and custom option template (`#item`)
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

Prefer **`defineTheme({ … })`** in `ApplicationConfig.providers` for tokens (see [Application configuration](#application-configuration-definetheme)). Layout tokens (font, radius, shadow) can still be overridden in your app `@theme` block.

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

MIT

The bundled **[Heroicons](https://heroicons.com/)** outline SVG icons are © [Tailwind Labs](https://tailwindcss.com/), licensed under the [MIT License](https://github.com/tailwindlabs/heroicons/blob/master/LICENSE).
