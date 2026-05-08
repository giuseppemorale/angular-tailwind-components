import type { Preview } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindInput,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindNotification,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindSkeleton,
  TailwindSpinner,
  TailwindStep,
  TailwindStepper,
  TailwindTab,
  TailwindTabGroup,
  TailwindTable,
  TailwindTag,
  TailwindTimePicker,
  TailwindToast,
  TailwindToggle,
  TailwindTooltip,
  TailwindToolbar,
  TailwindDivider,
  TailwindMeter,
  TailwindSlider
} from '../src/public-api';

const ALL_COMPONENTS = [
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCard,
  TailwindCheckbox,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindInput,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindNotification,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindSkeleton,
  TailwindSpinner,
  TailwindStep,
  TailwindStepper,
  TailwindTab,
  TailwindTabGroup,
  TailwindTable,
  TailwindTag,
  TailwindTimePicker,
  TailwindToast,
  TailwindToggle,
  TailwindTooltip,
  TailwindToolbar,
  TailwindDivider,
  TailwindMeter,
  TailwindSlider
];

const preview: Preview = {
  decorators: [
    moduleMetadata({
      imports: ALL_COMPONENTS
    })
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      story: {
        height: '300px'
      }
    },
    options: {
      storySort: {
        order: ['Docs', 'Components'],
        method: 'alphabetical'
      }
    }
  }
};

export default preview;
