import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TailwindTag } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Components/Tag',
  component: TailwindTag,
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info']
    }
  }
};
export default meta;

export const Tags: StoryObj<TailwindTag> = {
  render: args => ({
    props: args,
    template: `<tailwind-tag ${argsToTemplate(args)}>${args.variant}</tailwind-tag>`
  }),
  args: {
    variant: 'neutral'
  }
};
