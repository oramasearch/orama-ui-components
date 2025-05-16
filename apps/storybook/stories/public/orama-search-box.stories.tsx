import type { Meta, StoryObj, WebComponentsRenderer } from '@storybook/web-components'
import type { Components } from '@orama/wc-components'
import demoIndexes from '../config'
import { html } from 'lit-html'
import type { DemoIndexConfig } from '../config'

type TemplateProps = Components.OramaSearchBox & { preset: Components.OramaSearchBox }
const meta: Meta<TemplateProps> = {
  title: 'Components/SearchBox',
  component: 'orama-search-box',
  argTypes: {
    preset: {
      options: Object.keys(demoIndexes),
      mapping: demoIndexes,
      control: { type: 'select' },
    },
    index: {
      control: { type: 'object' },
      table: {
        type: {
          summary: 'CloudIndexConfig',
          detail: `{
  api_key: string
  endpoint: string
}`,
        },
      },
    },
    searchPlaceholder: {
      control: { type: 'text' },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: { summary: '' },
      },
    },
    chatPlaceholder: {
      control: { type: 'text' },
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: { summary: '' },
      },
    },
    colorScheme: {
      options: ['light', 'dark', 'system'],
      table: {
        defaultValue: { summary: 'light' },
      },
      control: { type: 'radio' },
    },
    dictionary: {
      control: { type: 'object' },
      description: 'Dictionary of text strings used in the component',
      table: {
        type: { summary: 'Partial<dictionary>' },
        defaultValue: { summary: '{}' },
      },
    },
    disableChat: {
      control: { type: 'boolean', defaultValue: false },
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    showKeyboardShortcuts: {
      control: { type: 'boolean', defaultValue: false },
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
      description: 'Show keyboard shortcuts in the footer',
    },
    themeConfig: {
      control: false,
      table: {
        type: {
          summary: 'Partial<TThemeOverrides>',
        },
      },
    },
  },
}
export default meta

const Template = ({
  preset,
  chatPlaceholder,
  searchPlaceholder,
  colorScheme,
  disableChat,
  suggestions,
  open,
  facetProperty,
  themeConfig,
  index,
  clientInstance,
  sourceBaseUrl,
  sourcesMap,
  resultMap,
  dictionary,
  showKeyboardShortcuts,
}: TemplateProps) => {
  return html`<div>
      <div style="width: 240px">
        <orama-search-button>Search...</orama-search-button>
      </div>
      <orama-search-box
      .open=${open || preset?.open}
      .facetProperty=${facetProperty ? preset?.facetProperty : undefined}
      .resultMap=${resultMap || preset?.resultMap}
      .colorScheme=${colorScheme}
      .themeConfig=${themeConfig || preset.themeConfig}
      .index=${index || preset.index}
      .clientInstance=${clientInstance || preset.clientInstance}
      .suggestions=${suggestions || preset?.suggestions}
      .sourceBaseUrl=${sourceBaseUrl || preset?.sourceBaseUrl}
      .sourcesMap=${sourcesMap || preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .dictionary=${dictionary}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
      .linksTarget=${preset?.linksTarget}
      .searchParams=${preset?.searchParams}
      .showKeyboardShortcuts=${showKeyboardShortcuts}
      .relatedQueries=${preset?.relatedQueries}
    ></orama-search-box></div>`
}

const TemplateAsEmbed = ({
  preset,
  chatPlaceholder,
  searchPlaceholder,
  colorScheme,
  disableChat,
  open,
  facetProperty,
  resultMap,
  themeConfig,
  index,
  clientInstance,
  sourceBaseUrl,
  suggestions,
  sourcesMap,
  dictionary,
  showKeyboardShortcuts,
}: TemplateProps) => {
  return html`<div style="height: 420px">
    <orama-search-box
      layout="embed"
      .open=${open || preset?.open}
      .facetProperty=${facetProperty || preset?.facetProperty}
      .resultMap=${resultMap || preset?.resultMap}
      .colorScheme=${colorScheme}
      .themeConfig=${themeConfig || preset.themeConfig}
      .index=${index || preset.index}
      .clientInstance=${clientInstance || preset.clientInstance}
      .suggestions=${suggestions || preset?.suggestions}
      .sourceBaseUrl=${sourceBaseUrl || preset?.sourceBaseUrl}
      .sourcesMap=${sourcesMap || preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .dictionary=${dictionary}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
      .linksTarget=${preset?.linksTarget}
      .searchParams=${preset?.searchParams}
      .showKeyboardShortcuts=${showKeyboardShortcuts}
      .relatedQueries=${preset?.relatedQueries}
    ></orama-search-box>
  </div>`
}

type Story = StoryObj<Components.OramaSearchBox & { preset: keyof DemoIndexConfig }>

export const SearchBoxAsModal: Story = {
  render: Template as any,
  args: {
    preset: 'orama',
    colorScheme: 'light',
    disableChat: false,
    dictionary: {
      searchPlaceholder: 'Search our documentation...',
      chatPlaceholder: 'Ask our AI assistant...',
      noResultsFound: "We couldn't find any results",
      noResultsFoundFor: 'for',
      suggestions: 'You might want to try',
      seeAll: 'View all results',
      addMore: 'Load more',
      clearChat: 'Reset conversation',
      errorMessage: 'Oops! Something went wrong with your search.',
      disclaimer: 'AI-generated responses may not always be accurate.',
      startYourSearch: 'Begin your search',
      initErrorSearch: 'Search service initialization failed',
      initErrorChat: 'Chat service initialization failed',
      chatButtonLabel: 'Get AI summary',
    },
  },
}

export const SearchBoxAsEmbed: Story = {
  render: TemplateAsEmbed as any,
  args: {
    preset: 'orama',
    colorScheme: 'light',
    disableChat: false,
    dictionary: {
      searchPlaceholder: 'Search our documentation...',
      chatPlaceholder: 'Ask our AI assistant...',
      noResultsFound: "We couldn't find any results",
      noResultsFoundFor: 'for',
      suggestions: 'You might want to try',
      seeAll: 'View all results',
      addMore: 'Load more',
      clearChat: 'Reset conversation',
      errorMessage: 'Oops! Something went wrong with your search.',
      disclaimer: 'AI-generated responses may not always be accurate.',
      startYourSearch: 'Begin your search',
      initErrorSearch: 'Search service initialization failed',
      initErrorChat: 'Chat service initialization failed',
      chatButtonLabel: 'Get AI summary',
    },
  },
}
