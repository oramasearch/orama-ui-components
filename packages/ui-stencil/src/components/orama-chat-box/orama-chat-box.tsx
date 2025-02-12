import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { ChatService } from '@/services/ChatService'
import {
  generateRandomID,
  initOramaClient,
  validateCloudIndexConfig as validateCloudIndexOrInstance,
  updateCssVariables,
  updateThemeClasses,
} from '@/utils/utils'
import type {
  ChatMarkdownLinkHref,
  ChatMarkdownLinkTarget,
  ChatMarkdownLinkTitle,
  CloudIndexConfig,
  ColorScheme,
  OnAnswerGeneratedCallbackProps,
  OnAnswerSourceClickCallbackProps,
  OnChatMarkdownLinkClickedCallbackProps,
  onStartConversationCallbackProps,
  SourcesMap,
} from '@/types'
import type { TThemeOverrides } from '@/config/theme'
import type { OramaClient } from '@oramacloud/client'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'
import type { AnyOrama } from '@orama/orama'
import { initStore, type ChatStoreType } from '@/context/Context'

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

  /**
   * Component theme customization
   */
  @Prop() themeConfig?: Partial<TThemeOverrides>
  /**
   * Component color schema
   */
  @Prop() colorScheme?: ColorScheme = 'light'

  @State() componentID = generateRandomID('chat-box')
  @State() systemScheme: Omit<ColorScheme, 'system'> = 'light'

  schemaQuery!: MediaQueryList

  /**
   * Fired when answer generation is successfully completed
   */
  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>

  /**
   * Fired when the chat is cleared
   */
  @Event({ bubbles: true, composed: true }) clearChat: EventEmitter<void>

  /**
   * Fired as soon as the conversation is started
   */
  @Event({ bubbles: true, composed: true }) startConversation: EventEmitter<onStartConversationCallbackProps>

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
  @Watch('themeConfig')
  @Watch('colorScheme')
  watchHandler() {
    // This is a naive way to check if it is safe to eval this method (after componentWillLoad)
    if (!this.chatStore) {
      return
    }

    this.startChatService()
    this.updateTheme()
  }

  @Prop({ mutable: true }) chatStore: ChatStoreType

  componentWillLoad() {
    this.chatStore = initStore('chat', this.componentID)

    this.el.id = this.componentID
    this.schemaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemScheme = this.schemaQuery.matches ? 'dark' : 'light'
    this.updateTheme()

    this.schemaQuery.addEventListener('change', this.onPrefersColorSchemeChange)
    this.startChatService()
  }

  componentDidLoad() {
    this.el.id = this.componentID
    this.startChatService()
  }

  startChatService() {
    if (this.chatStore.state.chatService) return
    validateCloudIndexOrInstance(this.el, this.index, this.clientInstance)
    const oramaClient = this.clientInstance || initOramaClient(this.index)

    this.chatStore.state.chatService = new ChatService(oramaClient, this.chatStore)
  }

  updateTheme() {
    const scheme = updateThemeClasses(this.el, this.colorScheme, this.systemScheme)

    updateCssVariables(this.el, scheme as ColorScheme, this.themeConfig)
  }

  private onPrefersColorSchemeChange = (event) => {
    this.systemScheme = event.matches ? 'dark' : 'light'
    this.updateTheme()
  }

  disconnectedCallback() {
    this.schemaQuery?.removeEventListener('change', this.onPrefersColorSchemeChange)
  }

  render() {
    if (!this.chatStore.state.chatService) {
      return <orama-text as="p">Unable to initialize chat service</orama-text>
    }

    // Maintain backwards compatibility with dark theme default
    const defaultTheme = 'dark'
    const currentScheme = this.colorScheme === 'system' ? this.systemScheme : this.colorScheme || defaultTheme

    return (
      <Host class={`theme-${currentScheme}`}>
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
          {!!this.chatStore.state?.interactions?.length && (
            <div slot="chat-empty-state">
              <slot name="empty-state" />
            </div>
          )}
        </orama-chat>
      </Host>
    )
  }
}
