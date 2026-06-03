import {
  afterNextRender,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  computed,
  effect,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_TAILWIND_EDITOR_LABELS, TailwindEditorLabels, TailwindSize } from '../../models';
import { TAILWIND_EDITOR_LABELS } from '../../tokens';
import { TailwindSafeHtmlPipe } from '../../pipes/safehtml/safehtml.pipe';
import { TailwindButton } from '../button/button.component';
import { TailwindInput } from '../input/input.component';
import { TailwindModal } from '../modal/modal.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindEditorToolbar } from './editor-toolbar.component';
import type { EditorCommand, EditorToolbarPreset } from './models/editor-command.type';
import type { EditorBlockFormat } from './models/editor-command.type';
import {
  EditorHistory,
  executeEditorCommand,
  getActiveBlockCommand,
  getActiveCommands,
  handleEditorEnter,
  insertImage,
  insertLink,
  saveEditorSelection
} from './utils/editor-commands';
import { sanitizeEditorHtml } from './utils/editor-html-sanitizer';
import { handleEditorPaste } from './utils/editor-paste';
import { prettifyEditorHtml } from './utils/editor-html-format';
import { filterToolbarGroups, resolveToolbarGroups } from './utils/editor-toolbar-config';

@Component({
  imports: [TailwindEditorToolbar, TailwindModal, TailwindInput, TailwindButton, TailwindSafeHtmlPipe],
  selector: 'tailwind-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindEditor),
      multi: true
    }
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TailwindEditor extends TailwindComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
  private static nextFieldId = 0;
  private readonly fallbackFieldId = `tw-editor-${TailwindEditor.nextFieldId++}`;

  readonly editable = viewChild<ElementRef<HTMLElement>>('editable');
  readonly sourceTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('sourceTextarea');
  readonly sourceLineNumbers = viewChild<ElementRef<HTMLElement>>('sourceLineNumbers');
  readonly editorWrapper = viewChild<ElementRef<HTMLElement>>('editorWrapper');
  readonly linkModal = viewChild<TailwindModal>('linkModal');
  readonly imageUrlModal = viewChild<TailwindModal>('imageUrlModal');
  readonly imageFileInput = viewChild<ElementRef<HTMLInputElement>>('imageFileInput');

  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly minHeight = input<string>('12rem');
  readonly size = input<TailwindSize>('md');
  readonly readonly = input<boolean>(false);
  readonly helperText = input<string>('');
  readonly errorText = input<string>('');
  readonly hasError = input<boolean>(false);
  readonly toolbar = input<EditorToolbarPreset | EditorCommand[]>('full');
  readonly imageUrlEnabled = input<boolean>(true);
  readonly imageUploadEnabled = input<boolean>(true);
  readonly accept = input<string>('image/*');
  readonly maxFileSizeBytes = input<number | undefined>(undefined);
  readonly sanitize = input<boolean>(true);

  readonly value = model<string>('');
  readonly htmlChange = output<string>();

  readonly isDisabled = signal(false);
  readonly isCodeView = signal(false);
  readonly sourceHtml = signal('');
  readonly activeCommands = signal<Set<EditorCommand>>(new Set());
  readonly blockFormat = signal<EditorBlockFormat>('p');

  private readonly injector = inject(Injector);
  private readonly themeLabels = inject(TAILWIND_EDITOR_LABELS, { optional: true });

  readonly labels = computed<TailwindEditorLabels>(() => ({
    ...DEFAULT_TAILWIND_EDITOR_LABELS,
    ...this.themeLabels
  }));

  readonly linkUrl = model('');
  readonly linkText = model('');
  readonly imageUrl = model('');
  readonly imageAlt = model('');
  readonly imageValidationError = signal('');

  readonly isEditable = computed(() => !this.readonly() && !this.isDisabled());
  readonly toolbarDisabled = computed(() => this.readonly() || this.isDisabled());
  readonly fieldId = computed(() => this.id() ?? this.fallbackFieldId);
  readonly surfaceId = computed(() => `${this.fieldId()}-surface`);
  readonly labelId = computed(() => `${this.fieldId()}-label`);
  readonly helperId = computed(() => `${this.fieldId()}-helper`);
  readonly fileInputId = computed(() => `${this.fieldId()}-file`);
  readonly surfaceAriaLabelledBy = computed(() => (this.label() ? this.labelId() : null));
  readonly surfaceAriaLabel = computed(() =>
    this.label() ? null : (this.placeholder() || this.labels().surfaceAriaLabel)
  );
  /** Only when `contenteditable` is false; never set with `contenteditable="true"` (HTML-ARIA). */
  readonly surfaceAriaReadonly = computed(() => (this.readonly() && !this.isDisabled() ? true : null));
  readonly surfaceAriaDisabled = computed(() => (this.isDisabled() ? true : null));

  readonly toolbarGroups = computed(() =>
    filterToolbarGroups(resolveToolbarGroups(this.toolbar()), {
      imageUrlEnabled: this.imageUrlEnabled(),
      imageUploadEnabled: this.imageUploadEnabled()
    })
  );

  readonly wrapperClasses = computed(() => {
    const base = ['tailwind-editor rounded-md border bg-white overflow-hidden transition-colors duration-150'];
    if (this.isDisabled()) {
      return [...base, 'opacity-60 cursor-not-allowed border-neutral-200'].join(' ');
    }
    if (this.hasError()) {
      return [...base, 'border-danger-400'].join(' ');
    }
    return [...base, 'border-neutral-300'].join(' ');
  });

  readonly surfaceClasses = computed(() => this.fieldSurfaceClasses('cursor-text'));
  readonly sourceClasses = computed(() => this.codeSourceClasses());
  readonly sourcePanelClasses = computed(() => this.codeSourcePanelClasses());
  readonly sourceLineNumbersList = computed(() => {
    const lines = this.sourceHtml().split('\n').length;
    return Array.from({ length: Math.max(1, lines) }, (_, index) => index + 1);
  });

  private codeSourcePanelClasses(): string {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-base'
    };
    return sizeMap[this.size()];
  }

  private codeSourceClasses(): string {
    const focusClass = this.isEditable()
      ? this.hasError()
        ? 'outline-none focus:ring-1 focus:ring-inset focus:ring-danger-400'
        : 'outline-none focus:ring-1 focus:ring-inset focus:ring-slate-500'
      : 'outline-none';
    const cursor = this.readonly() || this.isDisabled() ? 'cursor-default' : 'cursor-text';
    return [focusClass, cursor].join(' ');
  }

  private fieldSurfaceClasses(cursor: string): string {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-2',
      sm: 'text-sm px-2.5 py-2',
      md: 'text-sm px-3 py-2.5',
      lg: 'text-base px-3.5 py-3',
      xl: 'text-base px-4 py-3.5'
    };
    const readonlyClass = this.readonly() || this.isDisabled() ? 'bg-neutral-50 cursor-default' : `bg-white ${cursor}`;
    const focusClass = this.isEditable()
      ? this.hasError()
        ? 'outline-none focus:ring-1 focus:ring-inset focus:ring-danger-400'
        : 'outline-none focus:ring-1 focus:ring-inset focus:ring-primary-500'
      : 'outline-none';
    return [sizeMap[this.size()], readonlyClass, focusClass, 'transition-shadow duration-150'].join(' ');
  }

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private selectionListener: (() => void) | null = null;
  private toolbarMouseDownListener: (() => void) | null = null;
  private syncingFromWrite = false;
  private readonly history = new EditorHistory();

  constructor() {
    super();
    effect(() => {
      if (!this.isEditable()) {
        this.activeCommands.set(new Set());
      }
    });
    effect(() => {
      const el = this.editable()?.nativeElement;
      if (!el || this.isCodeView()) return;
      el.contentEditable = this.isEditable() ? 'true' : 'false';
    });
    effect(() => {
      this.toolbarMouseDownListener?.();
      this.toolbarMouseDownListener = null;
      const wrapper = this.editorWrapper()?.nativeElement;
      if (!wrapper) return;
      const handler = (event: MouseEvent) => this.onEditorMouseDown(event);
      wrapper.addEventListener('mousedown', handler, true);
      this.toolbarMouseDownListener = () => wrapper.removeEventListener('mousedown', handler, true);
    });
  }

  ngAfterViewInit(): void {
    const html = this.value();
    this.sourceHtml.set(html);
    this.history.reset(html);
    if (html && !this.isCodeView()) {
      this.setDomHtml(html, false);
    }
  }

  ngOnDestroy(): void {
    this.detachSelectionListener();
    this.toolbarMouseDownListener?.();
    this.toolbarMouseDownListener = null;
  }

  writeValue(value: string | null): void {
    const html = value ?? '';
    if (html === this.value()) return;

    this.syncingFromWrite = true;
    this.value.set(html);
    const source = this.isCodeView() ? prettifyEditorHtml(html) : html;
    this.sourceHtml.set(source);
    this.history.reset(html);
    if (this.isCodeView()) {
      afterNextRender(() => this.patchSourceTextarea(source), { injector: this.injector });
    } else {
      this.setDomHtml(html, false);
    }
    this.syncingFromWrite = false;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onSurfaceInput(): void {
    if (!this.isEditable() || this.isCodeView() || this.syncingFromWrite) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    const raw = el.innerHTML;
    const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
    if (html !== raw) {
      this.setDomHtml(html, true);
    }
    this.emitValue(html);
    this.history.push(html);
    this.refreshActiveCommands();
  }

  onEditorMouseDown(event: MouseEvent): void {
    if (!this.isEditable()) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.tailwind-editor-toolbar button')) return;
    const el = this.editable()?.nativeElement;
    if (el && !this.isCodeView()) saveEditorSelection(el);
    event.preventDefault();
  }

  onSurfaceBlur(event: FocusEvent): void {
    const next = event.relatedTarget as HTMLElement | null;
    if (next?.closest('.tailwind-editor-toolbar')) return;
    this.onTouched();
    this.detachSelectionListener();
  }

  onSurfaceFocus(): void {
    if (!this.isEditable()) return;
    const el = this.editable()?.nativeElement;
    if (el) saveEditorSelection(el);
    this.attachSelectionListener();
    this.refreshActiveCommands();
  }

  onSourceInput(event: Event): void {
    if (!this.isEditable() || !this.isCodeView() || this.syncingFromWrite) return;
    const html = (event.target as HTMLTextAreaElement).value;
    this.syncSourceHtml(html);
  }

  onSourceKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab' || !this.isEditable() || !this.isCodeView()) return;

    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd, value } = textarea;
    const updated = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
    const caret = selectionStart + 2;
    this.patchSourceTextarea(updated, { start: caret, end: caret });
    this.syncSourceHtml(updated);
  }

  onSourceScroll(): void {
    const gutter = this.sourceLineNumbers()?.nativeElement;
    const textarea = this.sourceTextarea()?.nativeElement;
    if (gutter && textarea) {
      gutter.scrollTop = textarea.scrollTop;
    }
  }

  onSourceBlur(): void {
    this.onTouched();
  }

  private syncSourceHtml(html: string): void {
    this.sourceHtml.set(html);
    // Keep raw HTML while editing source; sanitize when returning to visual mode.
    this.emitValue(html);
  }

  private patchSourceTextarea(html: string, selection?: { start: number; end: number }): void {
    const textarea = this.sourceTextarea()?.nativeElement;
    if (!textarea) return;

    textarea.value = html;

    if (selection) {
      textarea.selectionStart = selection.start;
      textarea.selectionEnd = selection.end;
    }
  }

  onToolbarCommand(command: EditorCommand): void {
    if (this.toolbarDisabled()) return;

    if (command === 'code') {
      this.toggleCodeView();
      return;
    }
    if (this.isCodeView()) return;

    if (command === 'link') {
      this.linkUrl.set('');
      this.linkText.set('');
      this.linkModal()?.open();
      return;
    }
    if (command === 'imageUrl') {
      this.imageUrl.set('');
      this.imageAlt.set('');
      this.imageUrlModal()?.open();
      return;
    }
    if (command === 'imageUpload') {
      this.imageValidationError.set('');
      this.imageFileInput()?.nativeElement.click();
      return;
    }

    const el = this.editable()?.nativeElement;
    if (!el) return;

    if (command === 'undo' || command === 'redo') {
      const html = command === 'undo' ? this.history.undo() : this.history.redo();
      if (html != null) {
        this.setDomHtml(html, true);
        this.emitValue(html);
        this.refreshActiveCommands();
      }
      return;
    }

    executeEditorCommand(el, command);
    this.syncFromDom();
    saveEditorSelection(el);
  }

  confirmLink(): void {
    const url = this.linkUrl().trim();
    if (!url) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    insertLink(el, url, this.linkText());
    this.linkModal()?.close();
    this.syncFromDom();
  }

  confirmImageUrl(): void {
    const url = this.imageUrl().trim();
    if (!url) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    insertImage(el, url, this.imageAlt());
    this.imageUrlModal()?.close();
    this.syncFromDom();
  }

  onImageFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    const file = files[0];
    const err = this.validateImageFile(file);
    if (err) {
      this.imageValidationError.set(err);
      input.value = '';
      return;
    }

    void this.readImageAsDataUrl(file).then(dataUrl => {
      const el = this.editable()?.nativeElement;
      if (!el) return;
      insertImage(el, dataUrl, file.name);
      this.syncFromDom();
      input.value = '';
      this.imageValidationError.set('');
    });
  }

  onPaste(event: ClipboardEvent): void {
    if (!this.isEditable() || this.isCodeView()) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    handleEditorPaste(event, el, this.sanitize());
    this.syncFromDom();
  }

  private isShiftEnter(event: InputEvent): boolean {
    return 'getModifierState' in event && typeof event.getModifierState === 'function' && event.getModifierState('Shift');
  }

  onSurfaceBeforeInput(event: InputEvent): void {
    if (!this.isEditable() || this.isCodeView()) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;

    const { inputType } = event;
    if (inputType !== 'insertParagraph' && inputType !== 'insertLineBreak') return;
    if (inputType === 'insertLineBreak' && this.isShiftEnter(event)) return;

    if (handleEditorEnter(el)) {
      event.preventDefault();
      this.syncFromDom();
      saveEditorSelection(el);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isEditable() || this.isCodeView()) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      if (handleEditorEnter(el)) {
        event.preventDefault();
        this.syncFromDom();
        saveEditorSelection(el);
        return;
      }
    }

    if (!event.ctrlKey && !event.metaKey) return;

    const key = event.key.toLowerCase();
    const map: Record<string, EditorCommand> = {
      b: 'bold',
      i: 'italic',
      u: 'underline',
      z: 'undo',
      y: 'redo'
    };
    const command = map[key];
    if (!command) return;
    if (key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.onToolbarCommand('redo');
      return;
    }
    event.preventDefault();
    this.onToolbarCommand(command);
  }

  private emitValue(html: string): void {
    if (html !== this.value()) {
      this.value.set(html);
      this.onChange(html);
    }
    this.htmlChange.emit(html);
  }

  private syncFromDom(): void {
    const el = this.editable()?.nativeElement;
    if (!el || this.isCodeView()) return;
    const raw = el.innerHTML;
    const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
    if (html !== raw) {
      this.setDomHtml(html, true);
    }
    this.emitValue(html);
    this.history.push(html);
    this.refreshActiveCommands();
  }

  private setDomHtml(html: string, restoreFocus: boolean): void {
    const el = this.editable()?.nativeElement;
    if (!el || this.isCodeView()) return;
    const normalized = html || '';
    if (el.innerHTML === normalized) return;
    el.innerHTML = normalized || '';
    if (restoreFocus) {
      el.focus();
    }
  }

  private attachSelectionListener(): void {
    if (this.selectionListener) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    const handler = () => {
      saveEditorSelection(el);
      this.refreshActiveCommands();
    };
    document.addEventListener('selectionchange', handler);
    this.selectionListener = () => document.removeEventListener('selectionchange', handler);
  }

  private detachSelectionListener(): void {
    this.selectionListener?.();
    this.selectionListener = null;
  }

  private toggleCodeView(): void {
    if (this.isCodeView()) {
      const raw = this.sourceTextarea()?.nativeElement.value ?? this.sourceHtml();
      const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
      this.sourceHtml.set(html);
      this.isCodeView.set(false);
      this.emitValue(html);
      afterNextRender(
        () => {
          this.setDomHtml(html, true);
        },
        { injector: this.injector }
      );
      return;
    }

    this.detachSelectionListener();
    const el = this.editable()?.nativeElement;
    if (!el) return;
    const raw = el.innerHTML;
    const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
    const formatted = prettifyEditorHtml(html);
    this.sourceHtml.set(formatted);
    this.isCodeView.set(true);
    this.emitValue(html);
    afterNextRender(() => this.patchSourceTextarea(formatted), { injector: this.injector });
  }

  private refreshActiveCommands(): void {
    if (!this.isEditable() || this.isCodeView()) return;
    const el = this.editable()?.nativeElement;
    if (!el) return;
    this.activeCommands.set(getActiveCommands(el));
    const block = getActiveBlockCommand(el);
    if (
      block === 'p' ||
      block === 'h1' ||
      block === 'h2' ||
      block === 'h3' ||
      block === 'h4' ||
      block === 'h5' ||
      block === 'h6'
    ) {
      this.blockFormat.set(block);
    } else {
      this.blockFormat.set('p');
    }
  }

  private validateImageFile(file: File): string | null {
    const max = this.maxFileSizeBytes();
    if (max == null || file.size <= max) return null;
    const maxLabel =
      max >= 1024 * 1024
        ? `${(max / (1024 * 1024)).toFixed(1)} MB`
        : max >= 1024
          ? `${Math.round(max / 1024)} KB`
          : `${max} bytes`;
    return this.labels().imageMaxSizeError.replace('{max}', maxLabel);
  }

  private readImageAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') resolve(result);
        else reject(new Error('Unexpected read result'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('read error'));
      reader.readAsDataURL(file);
    });
  }
}
