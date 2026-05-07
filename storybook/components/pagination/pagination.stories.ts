import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindPagination } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindPagination> = {
  title: 'Components/Pagination',
  component: TailwindPagination,
  argTypes: {
    totalItems: { control: 'number' },
    pageSize: { control: 'number' },
    currentPage: { control: 'number' }
  }
};
export default meta;

export const Pagination: StoryObj<TailwindPagination> = {
  args: {
    pageSize: 10,
    maxVisible: 7,
    ariaLabel: 'Pagination',
    summaryTemplate: 'Visualizzati {start}-{end} di {total}',
    totalItems: 50
  }
};
