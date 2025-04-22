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

const Template = ({ preset, colorScheme }) => {
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
      .clearChatOnDisconnect=${preset?.clearChatOnDisconnect}
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
