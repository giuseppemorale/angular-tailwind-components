import type { Meta, StoryObj } from '@storybook/angular';
import { argsToTemplate } from '@storybook/angular';
import { TailwindRadioGroup } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindRadioGroup> = {
  title: 'Forms/RadioGroup',
  component: TailwindRadioGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<TailwindRadioGroup>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: [
        { value: 'free', label: 'Free ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â $0/month' },
        { value: 'pro', label: 'Pro ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â $12/month' },
        { value: 'enterprise', label: 'Enterprise ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Contact us' },
      ],
    },
    template: `<tailwind-radio-group [label]="label" [options]="options" style="max-width:320px;display:block"></tailwind-radio-group>`,
  }),
  args: { label: 'Plan' },
};

export const Horizontal: Story = {
  render: () => ({
    props: {
      options: [
        { value: 'sm', label: 'S' },
        { value: 'md', label: 'M' },
        { value: 'lg', label: 'L' },
        { value: 'xl', label: 'XL' },
      ],
    },
    template: `<tailwind-radio-group label="Size" [options]="options" orientation="horizontal"></tailwind-radio-group>`,
  }),
};


export const Interactive: Story = {
  render: (args) => ({
    props: args,
    template: `<tailwind-radio-group [label]="label" [options]="options" style="max-width:320px;display:block" ${argsToTemplate(args)}></tailwind-radio-group>`,
  }),
  args: {
    label: '',
    ariaLabel: '',
    options: [],
    size: 'md',
    orientation: 'vertical'
  }
};
