import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { chatContext } from '@/context/chatContext'
import { ChatService } from '@/services/ChatService'
import {
  generateRandomID,
  initOramaClient,
  validateCloudIndexConfig as validateCloudIndexOrInstance,
} from '@/utils/utils'
import type {
  ChatMarkdownLinkHref,
  ChatMarkdownLinkTarget,
  ChatMarkdownLinkTitle,
  CloudIndexConfig,
  OnAnswerGeneratedCallbackProps,
  OnAnswerSourceClickCallbackProps,
  OnChatMarkdownLinkClickedCallbackProps,
  SourcesMap,
} from '@/types'
import type { OramaClient } from '@oramacloud/client'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'
import type { AnyOrama } from '@orama/orama'

@Component({
  tag: 'orama-chat-box',
  styleUrl: 'orama-chat-box.scss',
  shadow: true,
})
export class ChatBox {
  @Element() el: HTMLElement
  @Prop() index?: CloudIndexConfig | CloudIndexConfig[]
  @Prop() clientInstance?: OramaClient | AnyOrama
  @Prop() sourceBaseUrl?: string
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() placeholder?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() suggestions?: string[]
  @Prop() autoFocus = true
  @Prop() systemPrompts?: string[]
  @Prop() prompt?: string
  @Prop() clearChatOnDisconnect = true
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @State() componentID = generateRandomID('chat-box')

  /**
   * Fired when answer generation is successfully completed
   */
  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>
  /**
   * Fired when user clicks on answer source
   */
  @Event({ bubbles: true, composed: true, cancelable: true })
  answerSourceClick: EventEmitter<OnAnswerSourceClickCallbackProps>
  /**
   * Fired when user clicks on chat markdown link
   */
  @Event({ bubbles: true, composed: true, cancelable: true })
  chatMarkdownLinkClicked: EventEmitter<OnChatMarkdownLinkClickedCallbackProps>

  @Watch('index')
  indexChanged() {
    this.startChatService()
  }

  componentWillLoad() {
    this.el.id = this.componentID
    this.startChatService()
  }

  startChatService() {
    validateCloudIndexOrInstance(this.el, this.index, this.clientInstance)
    const oramaClient = this.clientInstance || initOramaClient(this.index)

    if (chatContext.chatService) return
    chatContext.chatService = new ChatService(oramaClient)
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
          prompt={this.prompt}
          clearChatOnDisconnect={this.clearChatOnDisconnect}
          chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
          chatMarkdownLinkHref={this.chatMarkdownLinkHref}
        >
          {!!chatContext?.interactions?.length && (
            <div slot="chat-empty-state">
              <slot name="empty-state" />
            </div>
          )}
        </orama-chat>
      </Host>
    )
  }
}
