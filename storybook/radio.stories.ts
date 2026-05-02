import type { Meta, StoryObj } from '@storybook/angular';
import { AtcRadioGroup } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcRadioGroup> = {
  title: 'Components/RadioGroup',
  component: AtcRadioGroup,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<AtcRadioGroup>;

export const Default: Story = {
  render: (args) => ({
    props: {
      ...args,
      options: [
        { value: 'free', label: 'Free â€” $0/month' },
        { value: 'pro', label: 'Pro â€” $12/month' },
        { value: 'enterprise', label: 'Enterprise â€” Contact us' },
      ],
    },
    template: `<atc-radio-group [label]="label" [options]="options" style="max-width:320px;display:block"></atc-radio-group>`,
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
    template: `<atc-radio-group label="Size" [options]="options" orientation="horizontal"></atc-radio-group>`,
  }),
};
