import type { Meta, StoryObj } from '@storybook/angular';
import { AtcPagination } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<AtcPagination> = {
  title: 'Components/Pagination',
  component: AtcPagination,
  tags: ['autodocs'],
  argTypes: {
    totalPages: { control: 'number' },
    currentPage: { control: 'number' },
    maxVisible: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<AtcPagination>;

export const Default: Story = {
  render: () => ({
    props: { totalPages: 10, currentPage: 1 },
    template: `<atc-pagination [totalPages]="totalPages" [(currentPage)]="currentPage"></atc-pagination>`,
  }),
};

export const ManyPages: Story = {
  render: () => ({
    props: { totalPages: 50, currentPage: 25 },
    template: `<atc-pagination [totalPages]="totalPages" [(currentPage)]="currentPage"></atc-pagination>`,
  }),
};
