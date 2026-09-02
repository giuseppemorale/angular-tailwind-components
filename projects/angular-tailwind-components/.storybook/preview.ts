import { provideRouter, withDisabledInitialNavigation } from '@angular/router';
import type { Preview, StoryContext } from '@storybook/angular';

import { applicationConfig, moduleMetadata } from '@storybook/angular';
import {
  TailwindAccordionModule,
  TailwindAlertModule,
  TailwindAutocompleteModule,
  TailwindAvatarModule,
  TailwindBadgeModule,
  TailwindBreadcrumbModule,
  TailwindButtonModule,
  TailwindCalendarPanelModule,
  TailwindCardModule,
  TailwindCarouselModule,
  TailwindCheckboxModule,
  TailwindChipModule,
  TailwindDatePickerModule,
  TailwindDateTimePickerModule,
  TailwindDividerModule,
  TailwindDrawerModule,
  TailwindEditorModule,
  TailwindEmptyStateModule,
  TailwindIconModule,
  TailwindInputModule,
  TailwindInputOtpModule,
  TailwindInputPasswordModule,
  TailwindKbdModule,
  TailwindMenuModule,
  TailwindMessageModule,
  TailwindMeterModule,
  TailwindModalModule,
  TailwindNumberInputModule,
  TailwindOrderListModule,
  TailwindPaginationModule,
  TailwindPopconfirmModule,
  TailwindPopoverModule,
  TailwindProgressBarModule,
  TailwindRadioGroupModule,
  TailwindRatingModule,
  TailwindSegmentedControlModule,
  TailwindSelectModule,
  TailwindSkeletonModule,
  TailwindSliderModule,
  TailwindSpinnerModule,
  TailwindStepperModule,
  TailwindTabGroupModule,
  TailwindTableModule,
  TailwindTagModule,
  TailwindTextareaModule,
  TailwindTimePickerModule,
  TailwindTimelineModule,
  TailwindTitleModule,
  TailwindToastModule,
  TailwindToggleModule,
  TailwindToolbarModule,
  TailwindTooltipModule,
  TailwindTreeModule,
  TailwindUploadModule
} from '../src/public-api';
import docJson from '../../../documentation.json';
import { registerCompodocJson } from './compodoc';

// Alimenta <ArgTypes> con input/output estratti dai sorgenti: `documentation.json` è rigenerato
// dai target Storybook (compodoc: true) o a mano con `npm run docs:json`.
registerCompodocJson(docJson);

// Ogni modulo porta con sé tutti i declarable della sua famiglia, quindi le stories non devono
// elencare sotto-componenti e direttive.
const ALL_MODULES = [
  TailwindAccordionModule,
  TailwindAlertModule,
  TailwindAutocompleteModule,
  TailwindAvatarModule,
  TailwindBadgeModule,
  TailwindBreadcrumbModule,
  TailwindButtonModule,
  TailwindCalendarPanelModule,
  TailwindCardModule,
  TailwindCarouselModule,
  TailwindCheckboxModule,
  TailwindChipModule,
  TailwindDatePickerModule,
  TailwindDateTimePickerModule,
  TailwindDividerModule,
  TailwindDrawerModule,
  TailwindEditorModule,
  TailwindEmptyStateModule,
  TailwindIconModule,
  TailwindInputModule,
  TailwindInputOtpModule,
  TailwindInputPasswordModule,
  TailwindKbdModule,
  TailwindMenuModule,
  TailwindMessageModule,
  TailwindMeterModule,
  TailwindModalModule,
  TailwindNumberInputModule,
  TailwindOrderListModule,
  TailwindPaginationModule,
  TailwindPopconfirmModule,
  TailwindPopoverModule,
  TailwindProgressBarModule,
  TailwindRadioGroupModule,
  TailwindRatingModule,
  TailwindSegmentedControlModule,
  TailwindSelectModule,
  TailwindSkeletonModule,
  TailwindSliderModule,
  TailwindSpinnerModule,
  TailwindStepperModule,
  TailwindTabGroupModule,
  TailwindTableModule,
  TailwindTagModule,
  TailwindTextareaModule,
  TailwindTimePickerModule,
  TailwindTimelineModule,
  TailwindTitleModule,
  TailwindToastModule,
  TailwindToggleModule,
  TailwindToolbarModule,
  TailwindTooltipModule,
  TailwindTreeModule,
  TailwindUploadModule
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
      imports: ALL_MODULES
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
