import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { chatContext } from '@/context/chatContext'
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
  SourcesMap,
} from '@/types'
import type { TThemeOverrides } from '@/config/theme'
import type { OramaClient } from '@oramacloud/client'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'
import type { AnyOrama, Orama } from '@orama/orama'

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
    this.startChatService()
    this.updateTheme()
  }

  componentWillLoad() {
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
    validateCloudIndexOrInstance(this.el, this.index, this.clientInstance)
    const oramaClient = this.clientInstance || initOramaClient(this.index)

    chatContext.chatService = new ChatService(oramaClient)
  }

  updateTheme() {
    const scheme = updateThemeClasses(
      this.el,
      this.colorScheme,
      this.systemScheme
    )

    updateCssVariables(
      this.el,
      scheme as ColorScheme,
      this.themeConfig
    )
  }

  private onPrefersColorSchemeChange = (event) => {
    this.systemScheme = event.matches ? 'dark' : 'light'
    this.updateTheme()
  }

  disconnectedCallback() {
    this.schemaQuery?.removeEventListener('change', this.onPrefersColorSchemeChange)
  }

  render() {
    if (!chatContext.chatService) {
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
