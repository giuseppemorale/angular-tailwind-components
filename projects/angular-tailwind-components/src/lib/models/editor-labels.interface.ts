/** Labels for `tailwind-editor` modals, code view, and toolbar. */
export interface TailwindEditorLabels {
  /** Aria label for the heading style combobox. */
  textStyle: string;
  /** Toolbar: switch to HTML source view. */
  codeView: string;
  /** Toolbar: return to visual editor from HTML source view. */
  codeViewExit: string;
  /** Link modal title. */
  linkModalTitle: string;
  linkUrlLabel: string;
  linkUrlPlaceholder: string;
  linkTextLabel: string;
  linkTextPlaceholder: string;
  /** Image URL modal title. */
  imageModalTitle: string;
  imageUrlLabel: string;
  imageUrlPlaceholder: string;
  imageAltLabel: string;
  imageAltPlaceholder: string;
  /** Shared modal actions. */
  cancel: string;
  insert: string;
  /** Placeholder for the HTML source textarea. */
  htmlSourcePlaceholder: string;
  /** Image upload validation; use `{max}` for the formatted size limit. */
  imageMaxSizeError: string;
}

/**
 * Merges optional partial overrides onto {@link DEFAULT_TAILWIND_EDITOR_LABELS}.
 * Used by {@link provideTailwindConfig} and when providing {@link TAILWIND_EDITOR_LABELS} directly.
 */
export function resolveTailwindEditorLabels(overrides?: Partial<TailwindEditorLabels>): TailwindEditorLabels {
  return { ...DEFAULT_TAILWIND_EDITOR_LABELS, ...overrides };
}

export const DEFAULT_TAILWIND_EDITOR_LABELS: TailwindEditorLabels = {
  textStyle: 'Text style',
  codeView: 'Edit HTML',
  codeViewExit: 'Visual editor',
  linkModalTitle: 'Insert link',
  linkUrlLabel: 'URL',
  linkUrlPlaceholder: 'https://example.com',
  linkTextLabel: 'Text (optional)',
  linkTextPlaceholder: 'Link label',
  imageModalTitle: 'Insert image',
  imageUrlLabel: 'Image URL',
  imageUrlPlaceholder: 'https://example.com/image.png',
  imageAltLabel: 'Alt text',
  imageAltPlaceholder: 'Description',
  cancel: 'Cancel',
  insert: 'Insert',
  htmlSourcePlaceholder: 'Edit HTML source…',
  imageMaxSizeError: 'Image exceeds maximum size ({max}).'
};
