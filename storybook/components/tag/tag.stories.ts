import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindTag } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Display/Tag',
  component: TailwindTag,
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'transparent']
    }
  }
};
export default meta;

export const Tags: StoryObj<TailwindTag> = {
  render: args => ({
    props: args,
    template: `<tailwind-tag ${argsToTemplate(args)}>${args.color}</tailwind-tag>`
  }),
  args: {
    color: 'secondary'
  }
};
