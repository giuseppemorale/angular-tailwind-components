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
- 🎭 **Customizable** — Override theme tokens via Tailwind `@theme` directive

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

```css
@import 'tailwindcss';
```

Or define your own theme tokens following the design system schema.

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
- **Title** (`tailwind-title`): Semantic headings (`h1`–`h6`) with required `text` and optional Solar Line Duotone icon

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
- **Table** (`tailwind-table`): Data table with sorting

## Design System

The library uses a comprehensive design system defined via Tailwind CSS v4 `@theme` directive:

- **Colors**: Primary (blue), Success (green), Warning (amber), Danger (red), Info (cyan), Neutral surfaces
- **Typography**: Inter (sans), JetBrains Mono (mono)
- **Spacing**: Tailwind default scale
- **Border Radius**: xs through full
- **Shadows**: xs through 2xl
- **Z-Index**: Defined scale for overlays (dropdown → tooltip → toast)

### Customization

Override tokens in your main CSS:

```css
@theme {
  --color-primary-500: oklch(0.55 0.2 280); /* Change primary to purple */
  --color-primary-600: oklch(0.48 0.22 280);
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

The bundled **Solar Line Duotone** SVG icons are © [480 Design](https://www.figma.com/@480design) / [Solar Icons](https://solar-icons.vercel.app/icons), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
