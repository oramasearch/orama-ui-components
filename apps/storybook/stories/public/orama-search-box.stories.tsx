import type { Meta, StoryObj } from '@storybook/web-components'
import type { Components } from '@orama/wc-components'
import demoIndexes from '../config'
import { html } from 'lit-html'
import type { DemoIndexConfig } from '../config'

const meta: Meta<Components.OramaSearchBox & { preset: keyof DemoIndexConfig }> = {
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
  showKeyboardShortcuts,
}) => {
  return html`<div>
      <div style="width: 240px">
        <orama-search-button>Search...</orama-search-button>
      </div>
      <orama-search-box
      .open=${open || preset?.open}
      .facetProperty=${facetProperty || preset?.facetProperty}
      .resultMap=${resultMap || preset?.resultMap}
      .colorScheme=${colorScheme}
      .themeConfig=${themeConfig || preset.themeConfig}
      .index=${index || preset.index}
      .clientInstance=${clientInstance || preset.clientInstance}
      .instance=${preset.instance}
      .suggestions=${suggestions || preset?.suggestions}
      .sourceBaseUrl=${sourceBaseUrl || preset?.sourceBaseUrl}
      .sourcesMap=${sourcesMap || preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
      .linksTarget=${preset?.linksTarget}
      .placeholder=${preset?.placeholder}
      .searchParams=${preset?.searchParams}
      .showKeyboardShortcuts=${showKeyboardShortcuts}
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
  sourceBaseURL,
  suggestions,
  sourcesMap,
  showKeyboardShortcuts,
}) => {
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
      .instance=${preset.instance}
      .suggestions=${suggestions || preset?.suggestions}
      .sourceBaseUrl=${sourceBaseURL || preset?.sourceBaseUrl}
      .sourcesMap=${sourcesMap || preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
      .linksTarget=${preset?.linksTarget}
      .placeholder=${preset?.placeholder}
      .searchParams=${preset?.searchParams}
      .showKeyboardShortcuts=${showKeyboardShortcuts}
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
  },
}

export const SearchBoxAsEmbed: Story = {
  render: TemplateAsEmbed as any,
  args: {
    preset: 'orama',
    colorScheme: 'light',
    chatPlaceholder: 'Ask me anything...',
    disableChat: false,
  },
}
