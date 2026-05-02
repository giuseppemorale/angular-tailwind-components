import type { Preview } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  AtcAccordion, AtcAccordionItem,
  AtcAlert,
  AtcBadge,
  AtcBreadcrumb,
  AtcButton,
  AtcCard,
  AtcCheckbox,
  AtcChip,
  AtcDatePicker,
  AtcDateTimePicker,
  AtcDrawer,
  AtcForm,
  AtcInput,
  AtcMenu,
  AtcMessage,
  AtcModal,
  AtcModalContainer,
  AtcNotification,
  AtcPagination,
  AtcProgressBar,
  AtcRadioGroup,
  AtcSelect,
  AtcSkeleton,
  AtcSpinner,
  AtcStep, AtcStepper,
  AtcTab, AtcTabGroup,
  AtcTable,
  AtcTag,
  AtcTimePicker,
  AtcToastContainer,
  AtcToggle,
  AtcTooltip,
} from '../src/public-api';

const ALL_COMPONENTS = [
  AtcAccordion, AtcAccordionItem,
  AtcAlert,
  AtcBadge,
  AtcBreadcrumb,
  AtcButton,
  AtcCard,
  AtcCheckbox,
  AtcChip,
  AtcDatePicker,
  AtcDateTimePicker,
  AtcDrawer,
  AtcForm,
  AtcInput,
  AtcMenu,
  AtcMessage,
  AtcModal,
  AtcModalContainer,
  AtcNotification,
  AtcPagination,
  AtcProgressBar,
  AtcRadioGroup,
  AtcSelect,
  AtcSkeleton,
  AtcSpinner,
  AtcStep, AtcStepper,
  AtcTab, AtcTabGroup,
  AtcTable,
  AtcTag,
  AtcTimePicker,
  AtcToastContainer,
  AtcToggle,
  AtcTooltip,
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