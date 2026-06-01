import type { Meta, StoryObj } from '@storybook/angular';
import { TAILWIND_HEROICON_NAMES, TailwindSpinner } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindSpinner> = {
  title: 'Feedback/Spinner',
  component: TailwindSpinner,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    color: {
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      control: { type: 'select' }
    },
    icon: { control: { type: 'select' }, options: TAILWIND_HEROICON_NAMES },
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
  parameters: {
    controls: { exclude: ['orientation', 'label'] }
  },
  args: {
    icon: 'arrow-path',
    size: 'md',
    color: 'primary',
    label: '',
    ariaLabel: 'Loading'
  }
};

export const WithLabel: StoryObj<TailwindSpinner> = {
  args: {
    icon: 'arrow-path',
    size: 'md',
    color: 'primary',
    label: 'Loading data...',
    ariaLabel: 'Loading',
    orientation: 'horizontal'
  }
};
