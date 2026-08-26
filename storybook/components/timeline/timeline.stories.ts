import { type Meta, type StoryObj } from '@storybook/angular';
import { TailwindTimeline } from '../../../projects/angular-tailwind-components/src/public-api';

const meta: Meta<TailwindTimeline> = {
  title: 'Display/Timeline',
  component: TailwindTimeline
};
export default meta;

export const Timeline: StoryObj<TailwindTimeline> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <tailwind-timeline ariaLabel="Order history">
        <tailwind-timeline-item title="Order placed" time="09:12" color="success" icon="check">
          Payment authorised.
        </tailwind-timeline-item>
        <tailwind-timeline-item title="Packed" time="11:40" color="primary" icon="cube">
          Two parcels prepared for shipping.
        </tailwind-timeline-item>
        <tailwind-timeline-item title="Shipped" time="14:05" color="info" icon="truck">
          Tracking number issued.
        </tailwind-timeline-item>
        <tailwind-timeline-item title="Delivery attempt failed" time="Yesterday" color="danger" [last]="true">
          Nobody at the address.
        </tailwind-timeline-item>
      </tailwind-timeline>`
  })
};

export const WithoutIcons: StoryObj<TailwindTimeline> = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <tailwind-timeline ariaLabel="Activity">
        <tailwind-timeline-item title="Created" time="Mon" />
        <tailwind-timeline-item title="Reviewed" time="Tue" />
        <tailwind-timeline-item title="Approved" time="Wed" [last]="true" />
      </tailwind-timeline>`
  })
};
