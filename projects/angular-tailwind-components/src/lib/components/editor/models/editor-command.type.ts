/** Supported formatting commands for the editor toolbar. */
export type EditorCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList'
  | 'link'
  | 'imageUrl'
  | 'imageUpload'
  | 'code'
  | 'undo'
  | 'redo'
  | 'removeFormat';

export type EditorToolbarPreset = 'full' | 'minimal';

/** Block-level formats available in the heading select. */
export type EditorBlockFormat = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
