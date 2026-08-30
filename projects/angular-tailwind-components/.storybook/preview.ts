import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import type { Preview, StoryContext } from '@storybook/angular';

import { applicationConfig, moduleMetadata } from '@storybook/angular';
import {
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindAutocomplete,
  TailwindAvatar,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCalendarPanel,
  TailwindCard,
  TailwindCarousel,
  TailwindCarouselSlide,
  TailwindCheckbox,
  TailwindChip,
  TailwindDatePicker,
  TailwindDateTimePicker,
  TailwindDivider,
  TailwindDrawer,
  TailwindEditor,
  TailwindEmptyState,
  TailwindIcon,
  TailwindInput,
  TailwindInputOtp,
  TailwindInputPassword,
  TailwindKbd,
  TailwindMenu,
  TailwindMessage,
  TailwindMeter,
  TailwindModal,
  TailwindNumberInput,
  TailwindOrderList,
  TailwindPagination,
  TailwindPopconfirm,
  TailwindPopover,
  TailwindProgressBar,
  TailwindRadioGroup,
  TailwindRating,
  TailwindSegmentedControl,
  TailwindSelect,
  TailwindSelectAllHeaderDirective,
  TailwindSkeleton,
  TailwindSlider,
  TailwindSortHeaderDirective,
  TailwindSpinner,
  TailwindStep,
  TailwindStepper,
  TailwindTab,
  TailwindTabGroup,
  TailwindTable,
  TailwindTableRowDirective,
  TailwindTag,
  TailwindTextarea,
  TailwindTimeline,
  TailwindTimelineItem,
  TailwindTimePicker,
  TailwindTitle,
  TailwindToast,
  TailwindToggle,
  TailwindToolbar,
  TailwindTooltip,
  TailwindTree,
  TailwindUpload
} from '../src/public-api';
import docJson from '../../../documentation.json';
import { registerCompodocJson } from './compodoc';

// Alimenta <ArgTypes> con input/output estratti dai sorgenti: `documentation.json` è rigenerato
// dai target Storybook (compodoc: true) o a mano con `npm run docs:json`.
registerCompodocJson(docJson);

const ALL_COMPONENTS = [
  TailwindAccordion,
  TailwindAccordionItem,
  TailwindAlert,
  TailwindAvatar,
  TailwindBadge,
  TailwindBreadcrumb,
  TailwindButton,
  TailwindCalendarPanel,
  TailwindCard,
  TailwindCheckbox,
  TailwindChip,
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
  TailwindSegmentedControl,
  TailwindEmptyState,
  TailwindRating,
  TailwindPopover,
  TailwindNumberInput,
  TailwindKbd,
  TailwindTimeline,
  TailwindTimelineItem,
  TailwindPopconfirm,
  TailwindTree,
  TailwindCarousel,
  TailwindCarouselSlide,
  TailwindOrderList,
  TailwindSelectAllHeaderDirective,
  TailwindDivider,
  TailwindMeter,
  TailwindSlider,
  TailwindEditor
];

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

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideRouter([], withDisabledInitialNavigation())]
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
        order: ['Introduction', 'Docs', 'Form Controls', 'Display', 'Feedback', 'Navigation', 'Layout', 'Overlay'],
        method: 'alphabetical'
      }
    }
  }
};

export default preview;
