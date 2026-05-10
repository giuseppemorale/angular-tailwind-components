import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTextarea } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTextarea> = {
  title: 'Forms/Textarea',
  component: TailwindTextarea,
  parameters: {
    docs: {
      story: {
        height: '380px'
      }
    }
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    cols: { control: 'number' },
    maxlength: { control: 'number' },
    resize: { control: 'select', options: ['vertical', 'none', 'both', 'horizontal'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' },
    readonly: { control: 'boolean' }
  }
};
export default meta;

export const Textarea: StoryObj<TailwindTextarea> = {
  args: {
    label: 'Note',
    placeholder: 'Write something…',
    rows: 4,
    resize: 'vertical',
    size: 'md',
    helperText: 'Shown when there is no error.',
    hasError: false,
    errorText: ''
  }
};

export const WithError: StoryObj<TailwindTextarea> = {
  args: {
    label: 'Feedback',
    placeholder: 'Tell us what went wrong',
    rows: 3,
    size: 'md',
    helperText: '',
    hasError: true,
    errorText: 'Please enter at least 10 characters.'
  }
};
