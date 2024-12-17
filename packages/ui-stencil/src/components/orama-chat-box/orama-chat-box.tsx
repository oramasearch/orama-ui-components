import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { chatContext } from '@/context/chatContext'
import { ChatService } from '@/services/ChatService'
import { generateRandomID, initOramaClient, validateCloudIndexConfig } from '@/utils/utils'
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
import type { AnyOrama, Orama } from "@orama/orama"

@Component({
  tag: 'orama-chat-box',
  styleUrl: 'orama-chat-box.scss',
  shadow: true,
})
export class ChatBox {
  private initializationAttempts = 0;
  private readonly MAX_ATTEMPTS = 3;

  @Element() el: HTMLElement
  @Prop() index?: CloudIndexConfig
  @Prop() clientInstance?: OramaClient | AnyOrama
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
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @State() componentID = generateRandomID('chat-box')
  @State() private isServiceReady = false;

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
  async indexChanged(newValue: CloudIndexConfig) {
    if (newValue) {
      await this.startChatService();
    }
  }

  async componentWillLoad() {
    this.el.id = this.componentID;
    if (this.index || this.clientInstance) {
      await this.startChatService();
    }
  }

  async componentDidLoad() {
    if (!chatContext.chatService && (this.index || this.clientInstance)) {
      await this.startChatService();
    }
  }


  async startChatService() {
    if (this.initializationAttempts >= this.MAX_ATTEMPTS) {
      return;
    }

    try {
      if (!this.index && !this.clientInstance) {
        return;
      }

      validateCloudIndexConfig(this.el, this.index, this.clientInstance);
      const oramaClient = this.clientInstance || await initOramaClient(this.index);
      chatContext.chatService = new ChatService(oramaClient);
      this.isServiceReady = true;

      this.el.dispatchEvent(new CustomEvent('chatServiceReady'));
    } catch (error) {
      this.initializationAttempts++;
      console.error('Failed to initialize chat service:', error);
      this.el.dispatchEvent(new CustomEvent('chatServiceError', { detail: error }));
    }
  }

  render() {
    if (!this.isServiceReady) {
      return <orama-text as="p">Initializing chat service...</orama-text>;
    }

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
