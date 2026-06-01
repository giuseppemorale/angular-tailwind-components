import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindInputPassword } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindInputPassword> = {
  title: 'Forms/Input Password',
  component: TailwindInputPassword,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    hasError: { control: 'boolean' },
    feedback: { control: 'boolean' },
    toggleMask: { control: 'boolean' }
  }
};
export default meta;

export const Basic: StoryObj<TailwindInputPassword> = {
  parameters: { controls: { exclude: ['feedback', 'toggleMask', 'hasError', 'errorText'] } },
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    size: 'md',
    feedback: false,
    toggleMask: false,
    hasError: false,
    errorText: '',
    helperText: ''
  }
};

export const WithFeedback: StoryObj<TailwindInputPassword> = {
  parameters: { controls: { exclude: ['toggleMask', 'hasError', 'errorText'] } },
  args: {
    ...Basic.args,
    feedback: true,
    helperText: 'Type to see strength feedback.'
  }
};

export const WithToggleMask: StoryObj<TailwindInputPassword> = {
  parameters: { controls: { exclude: ['hasError', 'errorText'] } },
  args: {
    ...WithFeedback.args,
    toggleMask: true
  }
};

export const WithError: StoryObj<TailwindInputPassword> = {
  parameters: { controls: { exclude: ['feedback', 'toggleMask', 'helperText'] } },
  args: {
    ...Basic.args,
    hasError: true,
    errorText: 'Password is required'
  }
};
