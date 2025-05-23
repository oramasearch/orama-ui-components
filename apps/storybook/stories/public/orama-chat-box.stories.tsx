import type { Meta, StoryContext, StoryObj } from '@storybook/web-components'
import type { Components } from '@orama/wc-components'
import { html } from 'lit-html'
import demoIndexes from '../config'
import type { DemoIndexConfig } from '../config'

const meta: Meta<
  Components.OramaChatBox & {
    preset: DemoIndexConfig[keyof DemoIndexConfig]
  }
> = {
  title: 'Components/ChatBox',
  component: 'orama-chat-box',
  argTypes: {
    preset: {
      options: Object.keys(demoIndexes),
      mapping: demoIndexes,
      control: { type: 'select' },
    },
    colorScheme: {
      options: ['light', 'dark', 'system'],
      table: {
        defaultValue: { summary: 'dark' },
      },
      control: { type: 'radio' },
    },
    themeConfig: {
      control: false,
      table: {
        type: {
          summary: 'Partial<TThemeOverrides>',
        },
      },
    },
    dictionary: {
      control: { type: 'object' },
      table: {
        type: {
          summary: 'Partial<dictionary>',
          detail: `{
  chatPlaceholder: string
  initErrorChat: string
  disclaimer: string
  // ... other text properties
}`,
        },
      },
    },
    disclaimer: {
      control: { type: 'text' },
      table: {
        type: {
          summary: 'string',
        },
      },
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
    sourceBaseUrl: {
      control: { type: 'text' },
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    sourcesMap: {
      control: { type: 'object' },
      table: {
        type: {
          summary: 'SourcesMap',
          detail: `{
  title?: string
  description?: string
  path?: string
}`,
        },
      },
    },
    suggestions: {
      control: { object: 'object' },
      table: {
        type: {
          summary: 'string[]',
        },
      },
    },
  },
  parameters: {
    layout: 'set-height',
  },
  args: {
    colorScheme: 'dark' as const,
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
} satisfies Meta

export default meta

type TemplateProps = Components.OramaChatBox & { preset: DemoIndexConfig[keyof DemoIndexConfig] }

type OptionKey = keyof Components.OramaChatBox & keyof DemoIndexConfig[keyof DemoIndexConfig]

const Template = (args: TemplateProps, context: StoryContext) => {
  const { preset } = args
  const { loaded: oramaJsDatabaseInstance } = context

  const presetOrOverrideData = (key: OptionKey) => {
    return args[key] ?? preset[key]
  }

  return html`
    <orama-chat-box
      .index=${presetOrOverrideData('index')}
      .clientInstance=${presetOrOverrideData('clientInstance') || oramaJsDatabaseInstance}
      .oramaCoreClientInstance=${presetOrOverrideData('oramaCoreClientInstance')}
      .sourceBaseUrl=${presetOrOverrideData('sourceBaseUrl')}
      .sourcesMap=${presetOrOverrideData('sourcesMap')}
      .suggestions=${presetOrOverrideData('suggestions')}
      .systemPrompts=${presetOrOverrideData('systemPrompts')}
      .colorScheme=${presetOrOverrideData('colorScheme')}
      .themeConfig=${presetOrOverrideData('themeConfig')}
      .dictionary=${presetOrOverrideData('dictionary')}
      .clearChatOnDisconnect=${presetOrOverrideData('clearChatOnDisconnect')}
      prompt=${presetOrOverrideData('prompt')}
    ></orama-chat-box>
  `
}

type Story = StoryObj<Components.OramaChatBox & { preset: DemoIndexConfig[keyof DemoIndexConfig] }>

export const ChatBox: Story = {
  render: Template as any,
  loaders: [
    async ({ args }) => {
      if (args.preset.getOramaJSDatabase) {
        const oramaJsDatabaseInstance = await args.preset.getOramaJSDatabase()
        return oramaJsDatabaseInstance
      }
    },
  ],
  args: {
    preset: demoIndexes.orama,
  },
}
