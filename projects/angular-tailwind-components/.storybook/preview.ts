import { provideRouter } from '@angular/router';
import type { Preview } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
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
  TailwindIcon,
  TailwindInput,
  TailwindInputOtp,
  TailwindTextarea,
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
  TailwindTableRowDirective,
  TailwindSortHeaderDirective,
  TailwindTag,
  TailwindTimePicker,
  TailwindTitle,
  TailwindToast,
  TailwindToggle,
  TailwindTooltip,
  TailwindToolbar,
  TailwindUpload,
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
  TailwindIcon,
  TailwindInput,
  TailwindInputOtp,
  TailwindTextarea,
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
  TailwindTableRowDirective,
  TailwindSortHeaderDirective,
  TailwindTag,
  TailwindTimePicker,
  TailwindTitle,
  TailwindToast,
  TailwindToggle,
  TailwindTooltip,
  TailwindToolbar,
  TailwindUpload,
  TailwindDivider,
  TailwindMeter,
  TailwindSlider
];

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideRouter([])]
    }),
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
        order: ['Introduction', 'Docs', 'Components'],
        method: 'alphabetical'
      }
    }
  }
};

export default preview;
