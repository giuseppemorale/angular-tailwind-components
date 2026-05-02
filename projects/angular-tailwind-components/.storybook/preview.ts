import type { Preview } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  TailwindAccordion, TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindChip,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindForm,
  TailwindInput,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindModalContainer,
  TailwindNotification,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindSkeleton,
  TailwindSpinner,
  TailwindStep, TailwindStepper,
  TailwindTab, TailwindTabGroup,
  TailwindTable,
  TailwindTag,
  TailwindTimePicker,
  TailwindToastContainer,
  TailwindToggle,
  TailwindTooltip,
} from '../src/public-api';

const ALL_COMPONENTS = [
  TailwindAccordion, TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindChip,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindForm,
  TailwindInput,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindModalContainer,
  TailwindNotification,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindSkeleton,
  TailwindSpinner,
  TailwindStep, TailwindStepper,
  TailwindTab, TailwindTabGroup,
  TailwindTable,
  TailwindTag,
  TailwindTimePicker,
  TailwindToastContainer,
  TailwindToggle,
  TailwindTooltip,
];

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: ALL_COMPONENTS,
    }),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;