import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { chatContext } from '@/context/chatContext'
import { ChatService } from '@/services/ChatService'
import { generateRandomID, initOramaClient, validateCloudIndexConfig } from '@/utils/utils'
import type {
  ChatMarkdownLinkHref,
  ChatMarkdownLinkTitle,
  CloudIndexConfig,
  OnAnswerGeneratedCallbackProps,
  OnAnswerSourceClickCallbackProps,
  OnChatMarkdownLinkClickedCallbackProps,
  SourcesMap,
} from '@/types'
import type { OramaClient } from '@oramacloud/client'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'

@Component({
  tag: 'orama-chat-box',
  styleUrl: 'orama-chat-box.scss',
  shadow: true,
})
export class ChatBox {
  @Element() el: HTMLElement
  @Prop() index?: CloudIndexConfig
  @Prop() clientInstance?: OramaClient
  @Prop() sourceBaseUrl?: string
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() placeholder?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() suggestions?: string[]
  @Prop() autoFocus = true
  @Prop() systemPrompts?: string[]
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref

  @State() oramaClient: OramaClient
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
    validateCloudIndexConfig(this.el, this.index, this.clientInstance)
    this.oramaClient = this.clientInstance || initOramaClient(this.index)

    chatContext.chatService = new ChatService(this.oramaClient)
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
          chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
          chatMarkdownLinkHref={this.chatMarkdownLinkHref}
        >
          <div slot="chat-empty-state">
            <slot name="empty-state" />
          </div>
        </orama-chat>
      </Host>
    )
  }
}
