/** Labels for `tailwind-input-password` strength feedback panel. */
export interface TailwindPasswordLabels {
  /** Shown when the field is empty or as panel heading while typing. */
  prompt: string;
  /** Weak password strength label. */
  weak: string;
  /** Medium password strength label. */
  medium: string;
  /** Strong password strength label. */
  strong: string;
}

export const DEFAULT_TAILWIND_PASSWORD_LABELS: TailwindPasswordLabels = {
  prompt: 'Inserisci una password',
  weak: 'Debole',
  medium: 'Buona',
  strong: 'Forte'
};
