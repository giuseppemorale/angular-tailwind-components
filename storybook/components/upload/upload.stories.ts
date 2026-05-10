import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindUpload } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindUpload> = {
  title: 'Forms/Upload',
  component: TailwindUpload,
  parameters: {
    docs: {
      story: {
        height: '420px'
      }
    }
  },
  argTypes: {
    variant: { control: 'select', options: ['area', 'button'] },
    label: { control: 'text' },
    buttonLabel: { control: 'text' },
    areaTitle: { control: 'text' },
    areaHint: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    maxFileSizeBytes: { control: 'number' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    showClear: { control: 'boolean' },
    clearText: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' }
  }
};
export default meta;

export const Area: StoryObj<TailwindUpload> = {
  render: args => ({
    props: args,
    template: `
    <div class="max-w-xl">
      <tailwind-upload ${argsToTemplate(args)} />
    </div>
    `
  }),
  args: {
    variant: 'area',
    label: 'Attachment',
    areaTitle: 'Drop a file here',
    areaHint: 'or click to choose — images only',
    accept: 'image/*',
    helperText: 'Value bound as a data URL (base64) for forms.',
    hasError: false,
    errorText: ''
  }
};

export const ButtonVariant: StoryObj<TailwindUpload> = {
  name: 'Button',
  render: args => ({
    props: args,
    template: `
    <div class="max-w-xl">
      <tailwind-upload ${argsToTemplate(args)} />
    </div>
    `
  }),
  args: {
    variant: 'button',
    label: 'Document',
    buttonLabel: 'Upload PDF',
    accept: 'application/pdf',
    size: 'md'
  }
};
