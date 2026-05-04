import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindPagination } from '../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindPagination> = {
  title: 'Components/Pagination',
  component: TailwindPagination,
  tags: ['autodocs'],
  argTypes: {
    totalItems: { control: 'number' },
    pageSize: { control: 'number' },
    currentPage: { control: 'number' }
  },
  args: {
    pageSize: 10,
    maxVisible: 7,
    ariaLabel: 'Pagination',
    summaryTemplate: 'Showing {start}-{end} of {total}',
    totalItems: 0
  }
};
export default meta;

export const Pagination: StoryObj<TailwindPagination> = {
  render: () => ({
    props: { totalItems: 100, pageSize: 10, currentPage: 1 },
    template: `<tailwind-pagination [totalItems]="totalItems" [pageSize]="pageSize" [(currentPage)]="currentPage"></tailwind-pagination>`
  })
};
