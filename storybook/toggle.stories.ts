import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindToggle } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindToggle> = {
  title: 'Forms/Toggle',
  component: TailwindToggle,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    ariaLabel: { control: 'text' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] }
  }
};
export default meta;

export const Toggle: StoryObj<TailwindToggle> = {
  render: args => ({
    props: args,
    template: `<tailwind-toggle ${argsToTemplate(args)} />`,
    args: {
      label: 'Enable notifications',
      ariaLabel: '',
      size: 'md'
    }
  })
};
