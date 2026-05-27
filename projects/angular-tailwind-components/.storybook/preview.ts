import { provideRouter } from '@angular/router';
import type { Preview, StoryContext } from '@storybook/angular';

/** Preferisce il template inline della story rispetto al solo tag host del wrapper. */
function preferInlineTemplateSource(source: string, context: StoryContext): string {
  try {
    const story = context.originalStoryFn?.(context.args, context);
    const template = story?.template?.trim();
    if (template) {
      return template;
    }
  } catch {
    // story senza template inline
  }
  return source?.trim() ?? '';
}
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import {
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCalendarPanel,
  TailwindCard,
  TailwindCheckbox,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindIcon,
  TailwindInput,
  TailwindInputOtp,
  TailwindInputPassword,
  TailwindTextarea,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindAutocomplete,
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
  TailwindSlider,
  TailwindEditor
} from '../src/public-api';

const ALL_COMPONENTS = [
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCalendarPanel,
  TailwindCard,
  TailwindCheckbox,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDrawer,
  TailwindIcon,
  TailwindInput,
  TailwindInputOtp,
  TailwindInputPassword,
  TailwindTextarea,
  TailwindMenu,
  TailwindMessage,
  TailwindModal,
  TailwindPagination,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindSelect,
  TailwindAutocomplete,
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
  TailwindSlider,
  TailwindEditor
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
      codePanel: true,
      canvas: {
        sourceState: 'shown'
      },
      source: {
        type: 'dynamic',
        state: 'open',
        language: 'html',
        transform: preferInlineTemplateSource
      },
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
