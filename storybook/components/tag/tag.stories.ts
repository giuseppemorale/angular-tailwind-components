import { argsToTemplate, type Meta, type StoryObj } from '@storybook/angular';
import { TAILWIND_PALETTES, TailwindTag } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTag> = {
  title: 'Components/Tag',
  component: TailwindTag,
  argTypes: {
    color: { control: 'select', options: [...TAILWIND_PALETTES] }
  }
};
export default meta;

export const Tags: StoryObj<TailwindTag> = {
  render: args => ({
    props: args,
    template: `<tailwind-tag ${argsToTemplate(args)}>${args.color}</tailwind-tag>`
  }),
  args: {
    color: 'neutral'
  }
};
