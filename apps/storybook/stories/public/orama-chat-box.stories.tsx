import type { Meta, StoryObj } from '@storybook/web-components'
import type { Components } from '@orama/wc-components'
import { html } from 'lit-html'
import demoIndexes from '../config'
import type { DemoIndexConfig } from '../config'

const meta: Meta<
  Components.OramaChatBox & {
    preset: keyof DemoIndexConfig
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
    textDictionary: {
      control: { type: 'object' },
      table: {
        type: {
          summary: 'Partial<TextDictionary>',
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
      table: {
        type: {
          summary: 'string',
        },
      },
    },
    sourcesMap: {
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
} satisfies Meta

export default meta

const Template = ({ preset, colorScheme, textDictionary, disclaimer }: {
  preset: any;
  colorScheme?: string;
  textDictionary?: Record<string, string>;
  disclaimer?: string;
}) => {
  return html`
    <orama-chat-box
      .index=${preset?.index}
      .clientInstance=${preset?.clientInstance}
      .placeholder=${preset?.placeholder}
      .sourceBaseUrl=${preset?.sourceBaseUrl}
      .sourcesMap=${preset?.sourcesMap}
      .suggestions=${preset?.suggestions}
      .systemPrompts=${preset?.systemPrompts}
      .colorScheme=${colorScheme || preset?.colorScheme}
      .themeConfig=${preset?.themeConfig}
      .textDictionary=${textDictionary}
      .clearChatOnDisconnect=${preset?.clearChatOnDisconnect}
      .disclaimer=${disclaimer}
      prompt=${preset?.prompt}
    ></orama-chat-box>
  `
}

type Story = StoryObj<Components.OramaChatBox & { preset: keyof DemoIndexConfig }>

export const ChatBox: Story = {
  render: Template as any,
  args: {
    preset: 'orama',
    colorScheme: 'dark',
    textDictionary: {
      chatPlaceholder: 'Ask about our documentation...',
      initErrorChat: 'Chat service could not be initialized',
      disclaimer: 'Orama can make mistakes. Please verify the information.',
    },
    disclaimer: 'Orama can make mistakes. Please verify the information.',
    index: {
      api_key: 'LerNlbp6379jVKaPs4wt2nZT4MJZbU1J',
      endpoint: 'https://cloud.orama.run/v1/indexes/docs-orama-b3f5xd'
    },
    themeConfig: {
      radius: {
        // "--textarea-radius": '0px'
      },
      shadow: {
        // "--textarea-shadow": '0px 4px 24px 0px white'
      },
    },
  },
}
