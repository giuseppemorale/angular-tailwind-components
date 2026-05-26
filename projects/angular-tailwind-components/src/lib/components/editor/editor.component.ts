import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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
import { TailwindSize } from '../../models';
import { TailwindButton } from '../button/button.component';
import { TailwindInput } from '../input/input.component';
import { TailwindModal } from '../modal/modal.component';
import { TailwindComponent } from '../tailwind.component';
import { TailwindEditorToolbar } from './editor-toolbar.component';
import type { EditorCommand, EditorToolbarPreset } from './models/editor-command.type';
import type { EditorBlockFormat } from './models/editor-command.type';
import {
  executeEditorCommand,
  getActiveBlockCommand,
  insertImage,
  insertLink
} from './utils/editor-commands';
import { sanitizeEditorHtml } from './utils/editor-html-sanitizer';
import { handleEditorPaste } from './utils/editor-paste';
import { getActiveCommands } from './utils/editor-selection';
import { filterToolbarGroups, resolveToolbarGroups } from './utils/editor-toolbar-config';

@Component({
  imports: [TailwindEditorToolbar, TailwindModal, TailwindInput, TailwindButton],
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
  private static nextFileId = 0;
  private readonly fallbackFileId = `tw-editor-img-${TailwindEditor.nextFileId++}`;

  readonly editable = viewChild.required<ElementRef<HTMLElement>>('editable');
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
  readonly activeCommands = signal<Set<EditorCommand>>(new Set());
  readonly blockFormat = signal<EditorBlockFormat>('p');

  readonly linkUrl = model('');
  readonly linkText = model('');
  readonly imageUrl = model('');
  readonly imageAlt = model('');
  readonly imageValidationError = signal('');

  readonly isEditable = computed(() => !this.readonly() && !this.isDisabled());
  readonly toolbarDisabled = computed(() => this.readonly() || this.isDisabled());
  readonly fileInputId = computed(() => this.id() ?? this.fallbackFileId);

  readonly toolbarGroups = computed(() =>
    filterToolbarGroups(resolveToolbarGroups(this.toolbar()), {
      imageUrlEnabled: this.imageUrlEnabled(),
      imageUploadEnabled: this.imageUploadEnabled()
    })
  );

  readonly wrapperClasses = computed(() => {
    const base = [
      'tailwind-editor rounded-md border bg-white overflow-hidden transition-colors duration-150',
      'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2'
    ];
    if (this.isDisabled()) {
      return [...base, 'opacity-60 cursor-not-allowed border-neutral-200'].join(' ');
    }
    if (this.hasError()) {
      return [...base, 'border-danger-400 focus-within:outline-danger-500'].join(' ');
    }
    return [...base, 'border-neutral-300 focus-within:outline-primary-500'].join(' ');
  });

  readonly surfaceClasses = computed(() => {
    const sizeMap: Record<TailwindSize, string> = {
      xs: 'text-xs px-2 py-2',
      sm: 'text-sm px-2.5 py-2',
      md: 'text-sm px-3 py-2.5',
      lg: 'text-base px-3.5 py-3',
      xl: 'text-base px-4 py-3.5'
    };
    const readonlyClass =
      this.readonly() || this.isDisabled() ? 'bg-neutral-50 cursor-default' : 'bg-white cursor-text';
    return [sizeMap[this.size()], readonlyClass, 'outline-none'].join(' ');
  });

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private selectionListener: (() => void) | null = null;
  private syncingFromWrite = false;

  constructor() {
    super();
    effect(() => {
      if (!this.isEditable()) {
        this.activeCommands.set(new Set());
      }
    });
  }

  ngAfterViewInit(): void {
    const html = this.value();
    if (html) {
      this.setDomHtml(html, false);
    }
  }

  ngOnDestroy(): void {
    this.detachSelectionListener();
  }

  writeValue(value: string | null): void {
    this.syncingFromWrite = true;
    const html = value ?? '';
    this.value.set(html);
    this.setDomHtml(html, false);
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
    if (!this.isEditable() || this.syncingFromWrite) return;
    const raw = this.editable().nativeElement.innerHTML;
    const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
    if (html !== raw) {
      this.setDomHtml(html, true);
    }
    this.emitValue(html);
    this.refreshActiveCommands();
  }

  onSurfaceBlur(): void {
    this.onTouched();
    this.detachSelectionListener();
  }

  onSurfaceFocus(): void {
    if (!this.isEditable()) return;
    this.attachSelectionListener();
    this.refreshActiveCommands();
  }

  onToolbarCommand(command: EditorCommand): void {
    if (this.toolbarDisabled()) return;

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

    executeEditorCommand(this.editable().nativeElement, command);
    this.syncFromDom();
  }

  confirmLink(): void {
    const url = this.linkUrl().trim();
    if (!url) return;
    insertLink(this.editable().nativeElement, url, this.linkText());
    this.linkModal()?.close();
    this.syncFromDom();
  }

  confirmImageUrl(): void {
    const url = this.imageUrl().trim();
    if (!url) return;
    insertImage(this.editable().nativeElement, url, this.imageAlt());
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
      insertImage(this.editable().nativeElement, dataUrl, file.name);
      this.syncFromDom();
      input.value = '';
      this.imageValidationError.set('');
    });
  }

  onPaste(event: ClipboardEvent): void {
    if (!this.isEditable()) return;
    handleEditorPaste(event, this.editable().nativeElement, this.sanitize());
    this.syncFromDom();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isEditable()) return;
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
      executeEditorCommand(this.editable().nativeElement, 'redo');
      event.preventDefault();
      this.syncFromDom();
      return;
    }
    event.preventDefault();
    executeEditorCommand(this.editable().nativeElement, command);
    this.syncFromDom();
  }

  private emitValue(html: string): void {
    this.value.set(html);
    this.onChange(html);
    this.htmlChange.emit(html);
  }

  private syncFromDom(): void {
    const raw = this.editable().nativeElement.innerHTML;
    const html = this.sanitize() ? sanitizeEditorHtml(raw) : raw;
    if (html !== raw) {
      this.setDomHtml(html, true);
    }
    this.emitValue(html);
    this.refreshActiveCommands();
  }

  private setDomHtml(html: string, restoreFocus: boolean): void {
    const el = this.editable().nativeElement;
    const normalized = html || '';
    if (el.innerHTML === normalized) return;
    el.innerHTML = normalized || '';
    if (restoreFocus) {
      el.focus();
    }
  }

  private attachSelectionListener(): void {
    if (this.selectionListener) return;
    const handler = () => this.refreshActiveCommands();
    document.addEventListener('selectionchange', handler);
    this.selectionListener = () => document.removeEventListener('selectionchange', handler);
  }

  private detachSelectionListener(): void {
    this.selectionListener?.();
    this.selectionListener = null;
  }

  private refreshActiveCommands(): void {
    if (!this.isEditable()) return;
    const el = this.editable().nativeElement;
    this.activeCommands.set(getActiveCommands(el));
    const block = getActiveBlockCommand(el);
    if (block === 'p' || block === 'h1' || block === 'h2' || block === 'h3' || block === 'h4' || block === 'h5' || block === 'h6') {
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
    return `Image exceeds maximum size (${maxLabel}).`;
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
