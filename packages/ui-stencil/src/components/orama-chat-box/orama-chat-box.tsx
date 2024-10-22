import { Component, Host, h, Prop, Watch, State, Element } from '@stencil/core'
import { chatContext } from '@/context/chatContext'
import { ChatService } from '@/services/ChatService'
import { generateRandomID, initOramaClient, validateCloudIndexConfig } from '@/utils/utils'
import type { CloudIndexConfig, SourcesMap } from '@/types'
import type { OramaClient } from '@oramacloud/client'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'
import type { Orama } from '@orama/orama'
import { Switch } from '@orama/switch'

@Component({
  tag: 'orama-chat-box',
  styleUrl: 'orama-chat-box.scss',
  shadow: true,
})
export class ChatBox {
  @Element() el: HTMLElement
  @Prop() index?: CloudIndexConfig
  @Prop() clientInstance?: OramaClient | Orama<unknown>
  @Prop() sourceBaseUrl?: string
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() placeholder?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() suggestions?: string[]
  @Prop() autoFocus = true
  @Prop() systemPrompts?: string[]

  @State() componentID = generateRandomID('chat-box')

  @Watch('index')
  indexChanged() {
    this.startChatService()
  }

  componentWillLoad() {
    this.el.id = this.componentID
    this.startChatService()
  }

  startChatService() {
    validateCloudIndexConfig(this.el, this.index, this.clientInstance)
    const oramaClient = this.clientInstance || initOramaClient(this.index)
    const switchInstance = new Switch(oramaClient)

    chatContext.chatService = new ChatService(switchInstance)
  }

  render() {
    if (!chatContext.chatService) {
      return <orama-text as="p">Unable to initialize chat service</orama-text>
    }

    return (
      // * Note: only dark theme supported at the moment
      <Host class="theme-dark">
        <orama-chat
          placeholder={this.placeholder}
          sourceBaseUrl={this.sourceBaseUrl}
          sourcesMap={this.sourcesMap}
          suggestions={this.suggestions}
          focusInput={this.autoFocus}
          systemPrompts={this.systemPrompts}
        >
          <div slot="chat-empty-state">
            <slot name="empty-state" />
          </div>
        </orama-chat>
      </Host>
    )
  }
}
