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
    chatPlaceholder: {
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: { summary: '' },
      },
    },
    searchPlaceholder: {
      table: {
        type: {
          summary: 'string',
        },
        defaultValue: { summary: 'Search...' },
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

const Template = ({ preset, chatPlaceholder, searchPlaceholder, colorScheme, disableChat }) => {
  return html`<div>
      <div style="width: 240px">
        <orama-search-button>Search...</orama-search-button>
      </div>
      <orama-search-box
      .open=${preset?.open}
      .facetProperty=${preset?.facetProperty}
      .resultMap=${preset?.resultMap}
      .colorScheme=${colorScheme}
      .themeConfig=${preset.themeConfig}
      .index=${preset.index}
      .instance=${preset.instance}
      .suggestions=${preset?.suggestions}
      .sourceBaseUrl=${preset?.sourceBaseUrl}
      .sourcesMap=${preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
    ></orama-search-box></div>`
}

const TemplateAsEmbed = ({ preset, chatPlaceholder, searchPlaceholder, colorScheme, disableChat }) => {
  return html`<div style="height: 420px">
    <orama-search-box
      layout="embed"
      .open=${preset?.open}
      .facetProperty=${preset?.facetProperty}
      .resultMap=${preset?.resultMap}
      .colorScheme=${colorScheme}
      .themeConfig=${preset.themeConfig}
      .index=${preset.index}
      .instance=${preset.instance}
      .suggestions=${preset?.suggestions}
      .sourceBaseUrl=${preset?.sourceBaseUrl}
      .sourcesMap=${preset?.sourcesMap}
      .disableChat=${disableChat}
      .chatPlaceholder=${chatPlaceholder}
      .searchPlaceholder=${searchPlaceholder}
      .highlightTitle=${preset?.highlightTitle}
      .highlightDescription=${preset?.highlightDescription}
    ></orama-search-box>
  </div>`
}

type Story = StoryObj<Components.OramaSearchBox & { preset: keyof DemoIndexConfig }>

export const SearchBox: Story = {
  render: Template as any,
  args: {
    preset: 'orama',
    colorScheme: 'light',
    searchPlaceholder: 'Search...',
    chatPlaceholder: 'Ask me anything...',
    disableChat: false,
  },
}

export const SearchBoxAsEmbed: Story = {
  render: TemplateAsEmbed as any,
  args: {
    preset: 'orama',
    colorScheme: 'light',
    searchPlaceholder: 'Search...',
    chatPlaceholder: 'Ask me anything...',
    disableChat: false,
  },
}
