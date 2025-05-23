import type { Meta, StoryContext, StoryObj } from '@storybook/web-components'
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

const Template = (args: TemplateProps, context: StoryContext) => {
  const { preset } = args
  const {
    loaded: { oramaJsDatabaseInstance },
  } = context

  const presetOrOverrideData = (key: OptionKey) => {
    return args[key] ?? preset[key]
  }

  return html`<div>
      <div style="width: 240px">
        <orama-search-button>Search...</orama-search-button>
      </div>
      <orama-search-box
      .open=${presetOrOverrideData('open')}
      .facetProperty=${presetOrOverrideData('facetProperty')}
      .resultMap=${presetOrOverrideData('resultMap')}
      .colorScheme=${presetOrOverrideData('colorScheme')}
      .themeConfig=${presetOrOverrideData('themeConfig')}
      .index=${presetOrOverrideData('index')}
      .clientInstance=${presetOrOverrideData('clientInstance') || oramaJsDatabaseInstance}
      .oramaCoreClientInstance=${presetOrOverrideData('oramaCoreClientInstance')}
      .suggestions=${presetOrOverrideData('suggestions')}
      .sourceBaseUrl=${presetOrOverrideData('sourceBaseUrl')}
      .sourcesMap=${presetOrOverrideData('sourcesMap')}
      .disableChat=${presetOrOverrideData('disableChat')}
      .chatPlaceholder=${presetOrOverrideData('chatPlaceholder')}
      .searchPlaceholder=${presetOrOverrideData('searchPlaceholder')}
      .dictionary=${presetOrOverrideData('dictionary')}
      .highlightTitle=${presetOrOverrideData('highlightTitle')}
      .highlightDescription=${presetOrOverrideData('highlightDescription')}
      .linksTarget=${presetOrOverrideData('linksTarget')}
      .searchParams=${presetOrOverrideData('searchParams')}
      .showKeyboardShortcuts=${presetOrOverrideData('showKeyboardShortcuts')}
      .relatedQueries=${presetOrOverrideData('relatedQueries')}
    ></orama-search-box></div>`
}

type OptionKey = keyof Components.OramaSearchBox

const TemplateAsEmbed = (args: TemplateProps, context: StoryContext) => {
  const { preset } = args
  const {
    loaded: { oramaJsDatabaseInstance },
  } = context

  const presetOrOverrideData = (key: OptionKey) => {
    return args[key] ?? preset[key]
  }

  return html`<div style="height: 420px">
    <orama-search-box
      layout="embed"
      .open=${presetOrOverrideData('open')}
      .facetProperty=${presetOrOverrideData('facetProperty')}
      .resultMap=${presetOrOverrideData('resultMap')}
      .colorScheme=${presetOrOverrideData('colorScheme')}
      .themeConfig=${presetOrOverrideData('themeConfig')}
      .index=${presetOrOverrideData('index')}
      .clientInstance=${presetOrOverrideData('clientInstance') || oramaJsDatabaseInstance}
      .oramaCoreClientInstance=${presetOrOverrideData('oramaCoreClientInstance')}
      .suggestions=${presetOrOverrideData('suggestions')}
      .sourceBaseUrl=${presetOrOverrideData('sourceBaseUrl')}
      .sourcesMap=${presetOrOverrideData('sourcesMap')}
      .disableChat=${presetOrOverrideData('disableChat')}
      .chatPlaceholder=${presetOrOverrideData('chatPlaceholder')}
      .searchPlaceholder=${presetOrOverrideData('searchPlaceholder')}
      .dictionary=${presetOrOverrideData('dictionary')}
      .highlightTitle=${presetOrOverrideData('highlightTitle')}
      .highlightDescription=${presetOrOverrideData('highlightDescription')}
      .linksTarget=${presetOrOverrideData('linksTarget')}
      .searchParams=${presetOrOverrideData('searchParams')}
      .showKeyboardShortcuts=${presetOrOverrideData('showKeyboardShortcuts')}
      .relatedQueries=${presetOrOverrideData('relatedQueries')}
    ></orama-search-box>
  </div>`
}

type Story = StoryObj<
  Components.OramaSearchBox & { preset: Omit<keyof DemoIndexConfig, keyof Components.OramaChatBox> }
>

export const SearchBoxAsModal: Story = {
  render: Template as any,
  loaders: [
    async ({ args }) => {
      if ((args.preset as any).getOramaJSDatabase) {
        const oramaJsDatabaseInstance = await (args.preset as any).getOramaJSDatabase()
        return { oramaJsDatabaseInstance }
      }

      return { oramaJsDatabaseInstance: undefined }
    },
  ],
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
  loaders: [
    async ({ args }) => {
      if ((args.preset as any).getOramaJSDatabase) {
        const oramaJsDatabaseInstance = await (args.preset as any).getOramaJSDatabase()
        return { oramaJsDatabaseInstance }
      }

      return { oramaJsDatabaseInstance: undefined }
    },
  ],
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
