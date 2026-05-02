# Angular Tailwind Components

A comprehensive Angular component library built entirely with **Tailwind CSS v4** — zero additional UI dependencies.

## Features

- 🎨 **31 components** — Buttons, Inputs, Modals, Tables, DatePickers, and more
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

Your consuming project must have **Tailwind CSS v4** configured. Add the library's theme tokens to your main stylesheet:

```css
@import 'tailwindcss';
@import 'angular-tailwind-components/src/lib/styles/tailwind.css';
```

Or define your own theme tokens following the design system schema.

## Quick Start

```typescript
import { Component } from '@angular/core';
import { AtcButton, AtcInput, AtcToggle } from 'angular-tailwind-components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AtcButton, AtcInput, AtcToggle],
  template: `
    <atc-input label="Email" placeholder="you@example.com" [(value)]="email" />
    <atc-toggle label="Notifications" [(checked)]="notifications" />
    <atc-button variant="primary" (clicked)="submit()">Submit</atc-button>
  `
})
export class ExampleComponent {
  email = '';
  notifications = true;
  submit() {
    /* ... */
  }
}
```

## Components

### Form Controls (with ControlValueAccessor)

| Component      | Selector              | Description                           |
| -------------- | --------------------- | ------------------------------------- |
| Input          | `atc-input`           | Text, email, password, number, search |
| Checkbox       | `atc-checkbox`        | Single checkbox with label            |
| Radio Group    | `atc-radio-group`     | Radio button group with options       |
| Select         | `atc-select`          | Native select with custom styling     |
| Toggle         | `atc-toggle`          | Switch on/off                         |
| DatePicker     | `atc-date-picker`     | Calendar date selection               |
| TimePicker     | `atc-time-picker`     | Time input                            |
| DateTimePicker | `atc-datetime-picker` | Combined date + time                  |

### Display

| Component | Selector     | Description                                |
| --------- | ------------ | ------------------------------------------ |
| Button    | `atc-button` | Primary, secondary, outline, ghost, danger |
| Badge     | `atc-badge`  | Status badges with dot indicator           |
| Card      | `atc-card`   | Content card with header/body/footer       |
| Chip      | `atc-chip`   | Removable tags                             |
| Tag       | `atc-tag`    | Semantic labels                            |

### Feedback

| Component    | Selector              | Description                                        |
| ------------ | --------------------- | -------------------------------------------------- |
| Alert        | `atc-alert`           | Contextual alerts (info, success, warning, danger) |
| Spinner      | `atc-spinner`         | Loading indicator                                  |
| Progress Bar | `atc-progress-bar`    | Determinate/indeterminate progress                 |
| Toast        | `atc-toast-container` | Global toast notifications (use `AtcToastService`) |
| Notification | `atc-notification`    | Inline notification with actions                   |
| Message      | `atc-message`         | Form-level inline message                          |
| Skeleton     | `atc-skeleton`        | Loading placeholder                                |

### Navigation

| Component  | Selector         | Description            |
| ---------- | ---------------- | ---------------------- |
| Tab Group  | `atc-tab-group`  | Tabbed content         |
| Breadcrumb | `atc-breadcrumb` | Navigation breadcrumbs |
| Pagination | `atc-pagination` | Page navigation        |
| Menu       | `atc-menu`       | Dropdown menu          |
| Stepper    | `atc-stepper`    | Step-by-step wizard    |

### Layout / Overlay

| Component | Selector        | Description             |
| --------- | --------------- | ----------------------- |
| Modal     | `atc-modal`     | Dialog overlay          |
| Drawer    | `atc-drawer`    | Slide-in panel          |
| Accordion | `atc-accordion` | Expandable sections     |
| Tooltip   | `atc-tooltip`   | Hover tooltip           |
| Form      | `atc-form`      | Form wrapper            |
| Table     | `atc-table`     | Data table with sorting |

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
@import 'tailwindcss';

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

## Adding New Components

1. Create a directory under `projects/angular-tailwind-components/src/lib/components/<name>/`
2. Create `<name>.ts` with inline template, styles, and component logic
3. Create `<name>.spec.ts` for unit tests
4. Export from `components/index.ts`
5. Add a story in `storybook/<name>.stories.ts`

### Component Conventions

- Use `input()` and `output()` signal functions (not decorators)
- Use `model()` for two-way binding
- Use `computed()` for derived Tailwind class logic
- Implement `ControlValueAccessor` for form controls
- Follow WCAG accessibility guidelines

## License

MIT
