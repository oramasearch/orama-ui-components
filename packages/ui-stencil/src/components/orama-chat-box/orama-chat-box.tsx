import { Component, Host, h, Prop, Watch, State, Element, type EventEmitter, Event } from '@stencil/core'
import { ChatService } from '@/services/ChatService'
import {
  generateRandomID,
  initOramaClient,
  updateCssVariables,
  updateThemeClasses,
  validateCloudIndexConfig,
} from '@/utils/utils'
import { defaultTextDictionary, getText as getTextUtil } from '@/utils/textDictionary'
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
  Dictionary,
} from '@/types'
import type { TThemeOverrides } from '@/config/theme'
import type { AnyOrama } from '@orama/orama'
import type { OramaClient } from '@oramacloud/client'
import type { CollectionManager } from '@orama/core'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowClockwise.mjs'
import { initStore, removeAllStores } from '@/ParentComponentStore/ParentComponentStoreManager'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

@Component({
  tag: 'orama-chat-box',
  styleUrl: 'orama-chat-box.scss',
  shadow: true,
})
export class ChatBox {
  @Element() htmlElement: HTMLElement
  @Prop() index?: CloudIndexConfig | CloudIndexConfig[]
  @Prop() clientInstance?: OramaClient | AnyOrama
  @Prop() oramaCoreClientInstance?: CollectionManager
  @Prop() sourceBaseUrl?: string
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() placeholder?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() suggestions?: string[]
  @Prop() relatedQueries?: number
  @Prop() autoFocus = true
  @Prop() systemPrompts?: string[]
  @Prop() prompt?: string
  @Prop() clearChatOnDisconnect = true
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  /**
   * Text dictionary for customizing all text content in the component.
   * This can be set either via HTML attribute as a JSON string or via JavaScript as an object.
   * It allows for customization of all text elements like placeholders, error messages, and UI labels.
   * @example
   * // Via HTML attribute
   * <orama-chat-box dictionary='{"chatPlaceholder": "Ask about our docs..."}' />
   *
   * // Via JavaScript
   * const chatBox = document.querySelector('orama-chat-box');
   * chatBox.dictionary = { chatPlaceholder: "Ask about our docs..." };
   */
  @Prop() dictionary?: Partial<Dictionary> = {}
  @Prop() disclaimer?: string

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
   * Gets the text for a specific key from the dictionary prop.
   * Prioritizes direct props (placeholder) for backward compatibility,
   * then falls back to the dictionary prop, and finally to the defaultTextDictionary.
   *
   * @param key - The key to get the text forstartChatService
   * @returns The text for the specified key
   */
  getText(key: keyof Dictionary): string {
    // Create a map of direct props for backward compatibility
    const directProps: Partial<Record<keyof Dictionary, string>> = {
      chatPlaceholder: this.placeholder,
    }

    return getTextUtil(key, this.dictionary, directProps)
  }

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
  @Watch('oramaCoreClientInstance')
  @Watch('clientInstance')
  watchHandler() {
    // This is a naive way to check if it is safe to eval this method (after componentWillLoad)
    if (!this.chatStore) {
      return
    }

    this.startChatService()
    this.updateTheme()
  }

  /**
   * Watch for changes to the dictionary prop
   */
  @Watch('dictionary')
  handleTextDictionaryChange(newValue: Partial<Dictionary> | string) {
    // Handle case where dictionary is passed as a string (via HTML attribute)
    if (typeof newValue === 'string') {
      try {
        this.dictionary = JSON.parse(newValue)
      } catch (e) {
        console.error('Error parsing dictionary:', e)
      }
    }
  }

  private chatStore: ChatStoreType

  componentWillLoad() {
    this.htmlElement.id = this.componentID
    this.schemaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemScheme = this.schemaQuery.matches ? 'dark' : 'light'
    this.updateTheme()

    this.schemaQuery.addEventListener('change', this.onPrefersColorSchemeChange)
    this.startChatService()
  }

  componentDidLoad() {
    this.htmlElement.id = this.componentID
    this.startChatService()
  }

  /**
   * Get the old Orama Client if oramaCore ins't available
   */
  getOldOramaClient() {
    if (this.oramaCoreClientInstance) {
      return undefined
    }

    if (this.clientInstance) {
      return this.clientInstance
    }

    return initOramaClient(this.index)
  }

  private startChatService() {
    if (!this.index && !this.clientInstance && !this.oramaCoreClientInstance) {
      console.error('Missing Index, ClientInstance or OramaCoreClientInstance')
      // Skip initialization if no index or clientInstance is provided
      return
    }

    validateCloudIndexConfig(this.htmlElement, this.index, this.clientInstance, this.oramaCoreClientInstance)
    const oldOramaClient = this.getOldOramaClient()
    this.chatStore.state.chatService = new ChatService(oldOramaClient, this.oramaCoreClientInstance, this.chatStore)

    if (!this.chatStore.state.chatService) {
      console.error('Failed to initialize chat service')
    }
  }

  updateTheme() {
    const scheme = updateThemeClasses(this.htmlElement, this.colorScheme, this.systemScheme)

    updateCssVariables(this.htmlElement, scheme as ColorScheme, this.themeConfig)
  }

  private onPrefersColorSchemeChange = (event) => {
    this.systemScheme = event.matches ? 'dark' : 'light'
    this.updateTheme()
  }

  connectedCallback() {
    this.chatStore = initStore('chat', this.componentID)
  }

  disconnectedCallback() {
    removeAllStores(this.componentID)

    this.schemaQuery?.removeEventListener('change', this.onPrefersColorSchemeChange)
  }

  render() {
    if (!this.chatStore.state.chatService) {
      return null
    }

    // Maintain backwards compatibility with dark theme default
    const defaultTheme = 'dark'
    const currentScheme = this.colorScheme === 'system' ? this.systemScheme : this.colorScheme || defaultTheme

    return (
      <Host class={`theme-${currentScheme}`}>
        <orama-chat
          placeholder={this.getText('chatPlaceholder')}
          sourceBaseUrl={this.sourceBaseUrl}
          sourcesMap={this.sourcesMap}
          suggestions={this.suggestions}
          relatedQueries={this.relatedQueries}
          focusInput={this.autoFocus}
          systemPrompts={this.systemPrompts}
          prompt={this.prompt}
          clearChatOnDisconnect={this.clearChatOnDisconnect}
          chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
          chatMarkdownLinkHref={this.chatMarkdownLinkHref}
          dictionary={this.dictionary}
          disclaimer={this.disclaimer}
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
