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

const Template = ({ preset }) => {
  return html`
    <orama-chat-box
      .index=${preset?.index}
      .instance=${preset?.instance}
      placeholder=${preset?.placeholder}
      sourceBaseUrl=${preset?.sourceBaseUrl}
      .sourcesMap=${preset?.sourcesMap}
      .suggestions=${preset?.suggestions}
      .systemPrompts=${preset?.systemPrompts}
      .clearChatOnDisconnect=${preset?.clearChatOnDisconnect}
      prompt=${preset?.prompt}
    ></orama-chat-box>
  `
}

type Story = StoryObj<Components.OramaChatBox & { preset: keyof DemoIndexConfig }>

export const ChatBox: Story = {
  render: Template,
  args: {
    preset: 'orama',
  },
}
