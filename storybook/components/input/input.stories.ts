import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindInput } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindInput> = {
  title: 'Forms/Input',
  component: TailwindInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: { control: 'select', options: ['text', 'password', 'email', 'number', 'search'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' }
  }
};
export default meta;

export const Input: StoryObj<TailwindInput> = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    size: 'md',
    helperText: 'We will never share your email.',
    hasError: false,
    errorText: ''
  }
};

export const WithError: StoryObj<TailwindInput> = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    type: 'text',
    size: 'md',
    helperText: '',
    hasError: true,
    errorText: 'Username is already taken'
  }
};
