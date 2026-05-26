import type { Meta, StoryObj } from '@storybook/angular';
import { TailwindTable } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTable> = {
  title: 'Components/Table',
  component: TailwindTable,
  parameters: { docs: { story: { height: '500px' } } },
  argTypes: {
    searchable: { control: 'boolean' },
    searchLabel: { control: 'text' },
    searchPlaceholder: { control: 'text' },
    selectable: { control: 'boolean' },
    striped: { control: 'boolean' },
    loading: { control: 'boolean' },
    emptyColspan: { control: 'number' },
    paginated: { control: 'boolean' },
    pagination: { control: 'object' }
  }
};
export default meta;

const rows: Record<string, unknown>[] = [
  { name: 'Zack Allen', email: 'zack.allen@example.com', role: 'Viewer', status: 1 },
  { name: 'Bob Smith', email: 'bob.smith@example.com', role: 'Editor', status: 1 },
  { name: 'Liam Jackson', email: 'liam.jackson@example.com', role: 'Viewer', status: 1 },
  { name: 'Samuel Robinson', email: 'samuel.robinson@example.com', role: 'Editor', status: 1 },
  { name: 'Carol White', email: 'carol.white@example.com', role: 'Viewer', status: 0 },
  { name: 'Mia White', email: 'mia.white@example.com', role: 'Editor', status: 0 },
  { name: 'David Brown', email: 'david.brown@example.com', role: 'Editor', status: 1 },
  { name: 'Eve Davis', email: 'eve.davis@example.com', role: 'Viewer', status: 1 },
  { name: 'Frank Miller', email: 'frank.miller@example.com', role: 'Editor', status: 0 },
  { name: 'Grace Wilson', email: 'grace.wilson@example.com', role: 'Viewer', status: 1 },
  { name: 'Henry Moore', email: 'henry.moore@example.com', role: 'Viewer', status: 1 },
  { name: 'Isabella Taylor', email: 'isabella.taylor@example.com', role: 'Admin', status: 1 },
  { name: 'Jack Anderson', email: 'jack.anderson@example.com', role: 'Editor', status: 0 },
  { name: 'Karen Thomas', email: 'karen.thomas@example.com', role: 'Viewer', status: 1 },
  { name: 'Noah Harris', email: 'noah.harris@example.com', role: 'Admin', status: 1 },
  { name: 'Paul Thompson', email: 'paul.thompson@example.com', role: 'Editor', status: 1 },
  { name: 'Quinn Garcia', email: 'quinn.garcia@example.com', role: 'Viewer', status: 0 },
  { name: 'Rachel Martinez', email: 'rachel.martinez@example.com', role: 'Viewer', status: 1 },
  { name: 'Tina Clark', email: 'tina.clark@example.com', role: 'Viewer', status: 1 },
  { name: 'Ursula Rodriguez', email: 'ursula.rodriguez@example.com', role: 'Admin', status: 0 },
  { name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Admin', status: 1 },
  { name: 'Victor Lewis', email: 'victor.lewis@example.com', role: 'Editor', status: 1 },
  { name: 'Wendy Lee', email: 'wendy.lee@example.com', role: 'Viewer', status: 1 },
  { name: 'Olivia Martin', email: 'olivia.martin@example.com', role: 'Viewer', status: 1 },
  { name: 'Xander Walker', email: 'xander.walker@example.com', role: 'Viewer', status: 0 },
  { name: 'Yvonne Hall', email: 'yvonne.hall@example.com', role: 'Editor', status: 1 }
];

export const Table: StoryObj<TailwindTable> = {
  render: args => ({
    props: {
      ...args,
      data: rows
    },
    template: `
      <tailwind-table
        [data]="data"
        [searchable]="searchable"
        [searchLabel]="searchLabel"
        [searchPlaceholder]="searchPlaceholder"
        [selectable]="selectable"
        [striped]="striped"
        [loading]="loading"
        emptyMessage="Nessun dato disponibile"
        [emptyColspan]="emptyColspan"
        [paginated]="paginated"
        [pagination]="pagination">
        <thead>
          <tr>
            <th scope="col" class="w-[22%]" tailwindSortHeader sortKey="name">Name</th>
            <th scope="col" class="min-w-0 w-[38%]" tailwindSortHeader sortKey="email">Email</th>
            <th scope="col" class="w-[20%]">Role</th>
            <th scope="col" class="w-[20%]">Status</th>
          </tr>
        </thead>
        <tbody *tailwindTableRow="let row">
          <tr>
            <td class="truncate">{{ row.name }}</td>
            <td class="min-w-0 truncate">{{ row.email }}</td>
            <td>{{ row.role }}</td>
            <td>
              <tailwind-tag [color]="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? 'Active' : 'Inactive' }}</tailwind-tag>
            </td>
          </tr>
        </tbody>
      </tailwind-table>
    `
  }),
  args: {
    searchable: true,
    searchPlaceholder: 'Cerca...',
    selectable: false,
    striped: false,
    loading: false,
    emptyColspan: 4,
    paginated: true,
    pagination: {
      totalItems: rows.length,
      pageSize: 10,
      currentPage: 1,
      ariaLabel: 'Paginazione',
      summary: 'Visualizzati {start} - {end} di {total} risultati'
    }
  }
};
