import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TailwindSize } from '../../models';
import { TailwindIcon } from '../icon/icon.component';
import { TailwindButton } from '../button/button.component';
import { TailwindComponent } from '../tailwind.component';

@Component({
  selector: 'tailwind-upload',
  imports: [TailwindIcon, TailwindButton],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TailwindUpload),
      multi: true
    }
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class TailwindUpload extends TailwindComponent implements ControlValueAccessor {
  private static nextId = 0;
  private readonly fallbackFileId = `tw-upload-${TailwindUpload.nextId++}`;

  readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  /** Visual layout: compact button or drop zone */
  readonly variant = input<'button' | 'area'>('area');
  /** Field label */
  readonly label = input<string>('');
  /** Button label when `variant` is `button` */
  readonly buttonLabel = input<string>('Choose file');
  /** Drop zone title when `variant` is `area` */
  readonly areaTitle = input<string>('Drag and drop a file');
  /** Drop zone hint when `variant` is `area` */
  readonly areaHint = input<string>('or click to browse');
  /** Accepted MIME types / extensions (native `accept`) */
  readonly accept = input<string | undefined>(undefined);
  /** Allow multiple files */
  readonly multiple = input<boolean>(false);
  /** Max size per file (bytes); if any file exceeds it, selection is rejected */
  readonly maxFileSizeBytes = input<number | undefined>(undefined);
  /** Button / control size */
  readonly size = input<TailwindSize>('md');
  /** Show a clear control when there is a value */
  readonly showClear = input<boolean>(true);
  /** Label for the clear action (i18n) */
  readonly clearText = input<string>('clear');
  readonly helperText = input<string>('');
  readonly errorText = input<string>('');
  readonly hasError = input<boolean>(false);

  /** Data URL (`data:<mime>;base64,...`) — forms / `[(value)]`; with `multiple`, only the first file is stored here */
  readonly value = model<string>('');

  /** Raw files after a successful selection */
  readonly filesSelected = output<File[]>();
  /** Human-readable validation message when selection is rejected */
  readonly validationError = output<string>();

  readonly isDisabled = signal(false);
  readonly isDragOver = signal(false);
  readonly selectedNames = signal<string[]>([]);

  private dragDepth = 0;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly fileInputId = computed(() => this.id() ?? this.fallbackFileId);

  readonly areaClasses = computed(() => {
    const base = [
      'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center',
      'transition-colors duration-150 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
    ];

    if (this.isDisabled()) {
      return [...base, 'cursor-not-allowed opacity-50 bg-surface-50 border-surface-200 text-surface-500'].join(' ');
    }
    if (this.isDragOver()) {
      return [...base, 'cursor-pointer border-primary-500 bg-primary-50/60 text-surface-800 focus-visible:outline-primary-500'].join(
        ' '
      );
    }
    if (this.hasError()) {
      return [
        ...base,
        'cursor-pointer border-danger-400 bg-danger-50/40 text-danger-900 focus-visible:outline-danger-500 hover:border-danger-500'
      ].join(' ');
    }
    return [
      ...base,
      'cursor-pointer border-surface-300 bg-surface-50/50 text-surface-800 focus-visible:outline-primary-500',
      'hover:border-primary-400 hover:bg-primary-50/30'
    ].join(' ');
  });

  writeValue(obj: string | null): void {
    this.value.set(obj ?? '');
    if (!obj) {
      this.selectedNames.set([]);
    }
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

  triggerPicker(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.isDisabled()) return;
    this.fileInput().nativeElement.click();
  }

  onKeydownArea(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.triggerPicker();
    }
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isDisabled()) return;
    this.dragDepth++;
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) {
      this.isDragOver.set(false);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragDepth = 0;
    this.isDragOver.set(false);
    if (this.isDisabled()) return;
    const files = event.dataTransfer?.files;
    if (files?.length) {
      void this.handleFiles(files);
    }
  }

  onNativeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files?.length) {
      void this.handleFiles(files);
    }
    input.value = '';
  }

  clear(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    if (this.isDisabled()) return;
    this.selectedNames.set([]);
    this.value.set('');
    this.onChange('');
    this.fileInput().nativeElement.value = '';
  }

  blurHost(): void {
    this.onTouched();
  }

  private validate(files: File[]): string | null {
    const max = this.maxFileSizeBytes();
    if (max == null) return null;
    const tooLarge = files.filter((f) => f.size > max);
    if (tooLarge.length === 0) return null;
    const maxLabel =
      max >= 1024 * 1024
        ? `${(max / (1024 * 1024)).toFixed(1)} MB`
        : max >= 1024
          ? `${Math.round(max / 1024)} KB`
          : `${max} bytes`;
    return tooLarge.length === 1
      ? `File exceeds maximum size (${maxLabel}).`
      : `${tooLarge.length} files exceed maximum size (${maxLabel}).`;
  }

  private async handleFiles(fileList: FileList): Promise<void> {
    let files = Array.from(fileList);
    if (!this.multiple() && files.length > 1) {
      files = [files[0]];
    }

    const err = this.validate(files);
    if (err) {
      this.validationError.emit(err);
      return;
    }

    this.selectedNames.set(files.map((f) => f.name));

    try {
      const dataUrls = await Promise.all(files.map((f) => this.readAsDataUrl(f)));
      this.filesSelected.emit(files);

      const primary = dataUrls[0] ?? '';
      this.value.set(primary);
      this.onChange(primary);
    } catch {
      this.validationError.emit('Could not read file.');
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Unexpected read result'));
        }
      };
      reader.onerror = () => reject(reader.error ?? new Error('read error'));
      reader.readAsDataURL(file);
    });
  }
}
