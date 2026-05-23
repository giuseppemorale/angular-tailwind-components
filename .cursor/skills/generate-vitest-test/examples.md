# Esempi dal repo

Riferimenti reali in `projects/angular-tailwind-components/src/lib/components/`:

| Componente | File | Cosa copre |
|------------|------|------------|
| Button | `button/button.component.spec.ts` | output, disabled, classi kind/color, token `TAILWIND_BUTTON_KIND` |
| Input | `input/input.component.spec.ts` | label, required, errorText, input event, CVA |
| Toggle | `toggle/toggle.component.spec.ts` | metodi pubblici, `setDisabledState`, `role="switch"` |
| Alert | `alert/alert.component.spec.ts` | dismiss, `model` dismissed, `role="alert"` |
| Checkbox | `checkbox/checkbox.component.spec.ts` | change event, CVA, label |
| Upload | `upload/upload.component.spec.ts` | varianti input, CVA, `clear()` |

Usa questi file come riferimento di tono e granularità, non copiarli integralmente se il componente target è diverso.
