import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindSpinner } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSpinner> = {
  title: 'Components/Spinner',
  component: TailwindSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    color: {
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      control: { type: 'select' }
    },
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' }
    }
  }
};
export default meta;

export const Spinner: StoryObj<TailwindSpinner> = {
  args: {
    size: 'md',
    color: 'primary',
    label: '',
    ariaLabel: 'Loading',
    orientation: 'horizontal'
  }
};

export const WithLabel: StoryObj<TailwindSpinner> = {
  args: {
    size: 'md',
    color: 'primary',
    label: 'Loading data...',
    ariaLabel: 'Loading',
    orientation: 'horizontal'
  }
};
