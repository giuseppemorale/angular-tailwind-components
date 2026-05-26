import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { TailwindEditor } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindEditor> = {
  title: 'Forms/Editor',
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
    hasError: { control: 'boolean' }
  }
};
export default meta;

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
    props: {
      ...args,
      value: '<p>Edit <strong>this</strong> content.</p>'
    },
    template: `
      <tailwind-editor
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
        [imageUploadEnabled]="imageUploadEnabled"
        [(value)]="value"
      />
      <pre class="mt-4 text-xs bg-neutral-100 p-3 rounded-md overflow-auto max-h-32">{{ value }}</pre>
    `
  })
};

export const Readonly: StoryObj<TailwindEditor> = {
  args: {
    ...Editor.args,
    readonly: true,
    label: 'Article (read-only)'
  },
  render: Editor.render
};

export const WithError: StoryObj<TailwindEditor> = {
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
  template: `
    <tailwind-editor label="Live preview" placeholder="Type here…" [(value)]="html" (htmlChange)="onChange($event)" />
    <p class="mt-3 text-xs text-neutral-600">htmlChange count: {{ changeCount() }}</p>
    <pre class="mt-2 text-xs bg-neutral-100 p-3 rounded-md overflow-auto max-h-32">{{ html() }}</pre>
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
  render: () => ({
    template: '<sb-html-change-demo />',
    moduleMetadata: {
      imports: [HtmlChangeDemoComponent]
    }
  })
};
