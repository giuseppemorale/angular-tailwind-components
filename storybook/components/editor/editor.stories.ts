import type { Meta, StoryObj } from '@storybook/angular';
import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import type {
  EditorCommand,
  EditorToolbarPreset
} from '../../../projects/angular-tailwind-components/src/lib/components/editor/models/editor-command.type';
import type { TailwindSize } from '../../../projects/angular-tailwind-components/src/public-api';
import { TailwindEditor } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindEditor> = {
  title: 'Form Controls/Editor',
  component: TailwindEditor,
  parameters: {
    docs: {
      story: {
        height: '420px'
      }
    }
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    minHeight: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    toolbar: { control: 'select', options: ['full', 'minimal'] },
    readonly: { control: 'boolean' },
    imageUrlEnabled: { control: 'boolean' },
    imageUploadEnabled: { control: 'boolean' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' },
    value: { control: false, table: { disable: true } }
  }
};
export default meta;

@Component({
  selector: 'sb-editor-story',
  imports: [TailwindEditor],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-editor
      [label]="label()"
      [placeholder]="placeholder()"
      [minHeight]="minHeight()"
      [size]="size()"
      [toolbar]="toolbar()"
      [helperText]="helperText()"
      [hasError]="hasError()"
      [errorText]="errorText()"
      [readonly]="readonly()"
      [imageUrlEnabled]="imageUrlEnabled()"
      [imageUploadEnabled]="imageUploadEnabled()"
      [(value)]="html" />
    <pre class="mt-4 text-xs bg-neutral-100 p-3 rounded-md overflow-auto max-h-32" tabindex="-1">{{ html() }}</pre>
  `
})
class EditorStoryComponent {
  readonly label = input('Description');
  readonly placeholder = input('Start writing…');
  readonly minHeight = input('14rem');
  readonly size = input<TailwindSize>('md');
  readonly toolbar = input<EditorToolbarPreset | EditorCommand[]>('full');
  readonly helperText = input('');
  readonly errorText = input('');
  readonly hasError = input(false);
  readonly readonly = input(false);
  readonly imageUrlEnabled = input(true);
  readonly imageUploadEnabled = input(true);

  readonly html = signal('<p>Edit <strong>this</strong> content.</p>');
}

export const Editor: StoryObj<TailwindEditor> = {
  args: {
    label: 'Description',
    placeholder: 'Start writing…',
    minHeight: '14rem',
    size: 'md',
    toolbar: 'full',
    helperText: 'Rich text is stored as sanitized HTML.',
    hasError: false,
    errorText: '',
    readonly: false,
    imageUrlEnabled: true,
    imageUploadEnabled: true
  },
  render: args => ({
    props: args,
    template: `<sb-editor-story
      [label]="label"
      [placeholder]="placeholder"
      [minHeight]="minHeight"
      [size]="size"
      [toolbar]="toolbar"
      [helperText]="helperText"
      [hasError]="hasError"
      [errorText]="errorText"
      [readonly]="readonly"
      [imageUrlEnabled]="imageUrlEnabled"
      [imageUploadEnabled]="imageUploadEnabled" />`,
    moduleMetadata: { imports: [EditorStoryComponent] }
  })
};

export const Readonly: StoryObj<TailwindEditor> = {
  parameters: { controls: { exclude: ['hasError', 'errorText', 'imageUrlEnabled', 'imageUploadEnabled'] } },
  args: {
    ...Editor.args,
    readonly: true,
    label: 'Article (read-only)'
  },
  render: Editor.render
};

export const WithError: StoryObj<TailwindEditor> = {
  parameters: { controls: { exclude: ['readonly', 'imageUrlEnabled', 'imageUploadEnabled'] } },
  args: {
    ...Editor.args,
    hasError: true,
    errorText: 'Content is required.',
    helperText: ''
  },
  render: Editor.render
};

@Component({
  selector: 'sb-html-change-demo',
  imports: [TailwindEditor],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <tailwind-editor label="Live preview" placeholder="Type here…" [(value)]="html" (htmlChange)="onChange($event)" />
    <p class="mt-3 text-xs text-neutral-600">htmlChange count: {{ changeCount() }}</p>
    <pre class="mt-2 text-xs bg-neutral-100 p-3 rounded-md overflow-auto max-h-32" tabindex="-1">{{ html() }}</pre>
  `
})
class HtmlChangeDemoComponent {
  html = signal('<p>Hello</p>');
  changeCount = signal(0);

  onChange(value: string): void {
    this.changeCount.update(n => n + 1);
    this.html.set(value);
  }
}

export const HtmlChange: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: '<sb-html-change-demo />',
    moduleMetadata: {
      imports: [HtmlChangeDemoComponent]
    }
  })
};
