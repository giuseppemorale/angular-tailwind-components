import type { TailwindOption } from '../../../models';
import type { EditorBlockFormat } from '../models/editor-command.type';

/** Block formats offered by the toolbar's text-style select. */
export const HEADING_OPTIONS: TailwindOption<EditorBlockFormat>[] = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' }
];
