import { Component, Fragment, Listen, Host, Prop, State, Watch, h, type EventEmitter, Event } from '@stencil/core'
import {
  TAnswerStatus,
  type ChatMarkdownLinkHref,
  type ChatMarkdownLinkTarget,
  type ChatMarkdownLinkTitle,
  type OnAnswerGeneratedCallbackProps,
  type onStartConversationCallbackProps,
  type SearchResult,
  type SourcesMap,
} from '@/types'
import '@phosphor-icons/webcomponents/dist/icons/PhPaperPlaneTilt.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhStopCircle.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowDown.mjs'
import { Store } from '@/StoreDecorator'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

const BOTTOM_THRESHOLD = 1

@Component({
  tag: 'orama-chat',
  styleUrl: 'orama-chat.scss',
})
export class OramaChat {
  @Prop() placeholder?: string = 'Ask me anything'
  @Prop() sourceBaseUrl?: string = ''
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() showClearChat?: boolean = true
  @Prop() defaultTerm?: string
  @Prop() focusInput?: boolean = false
  @Prop() suggestions?: string[]
  @Prop() relatedQueries?: number
  @Prop() prompt?: string
  @Prop() systemPrompts?: string[]
  @Prop() clearChatOnDisconnect?: boolean

  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>
  @Event({ bubbles: true, composed: true }) clearChat: EventEmitter<void>
  @Event({ bubbles: true, composed: true }) startConversation: EventEmitter<onStartConversationCallbackProps>

  @State() inputValue = ''
  @State() showGoToBottomButton = false

  @Listen('sourceItemClick')
  handleSourceItemClick(event: CustomEvent<SearchResult>) {
    // console.log(`Source item clicked: ${event.detail.title}`, event.detail)
  }

  @Watch('defaultTerm')
  handleDefaultTermChange() {
    if (this.defaultTerm) {
      this.chatStore.state.chatService?.sendQuestion(this.defaultTerm, this.relatedQueries, this.systemPrompts, {
        onAnswerGeneratedCallback: (params) => this.answerGenerated.emit(params),
      })
    }
  }

  @Watch('focusInput')
  focusInputWatcher() {
    this.handleFocus()
  }

  @Watch('prompt')
  promptWatcher(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.triggerSendQuestion(newValue, this.relatedQueries)
      this.chatStore.state.prompt = newValue
    }
  }

  triggerSendQuestion = (question: string, relatedQueries?: number) => {
    if (this.chatStore.state.chatService === null) {
      throw new Error('Chat Service is not initialized')
    }

    this.startConversation.emit({ userPrompt: question, systemPrompts: this.systemPrompts })

    this.chatStore.state.chatService.sendQuestion(question, relatedQueries, this.systemPrompts, {
      onAnswerGeneratedCallback: (params) => this.answerGenerated.emit(params),
    })
  }

  messagesContainerRef!: HTMLElement
  nonScrollableMessagesContainerRef!: HTMLElement
  textareaRef!: HTMLOramaTextareaElement
  isScrolling = false
  prevScrollTop = 0
  scrollTarget = 0

  pendingNewInteractionSideEffects = false

  scrollableContainerResizeObserver: ResizeObserver
  nonScrollableContainerResizeObserver: ResizeObserver

  lockScrollOnBottom = false

  @Store('chat')
  private chatStore: ChatStoreType

  componentWillLoad() {
    this.chatStore.on('set', (prop, newInteractions, oldInteractions) => {
      if (prop !== 'interactions') {
        return
      }

      if (oldInteractions?.length < newInteractions?.length) {
        this.lockScrollOnBottom = false
        this.pendingNewInteractionSideEffects = true
      }
    })
  }

  handleFocus = () => {
    if (this.focusInput) {
      const texteareaEl = this.textareaRef.querySelector('textarea')
      if (!texteareaEl) return
      // requestAnimationFrame used to ensure that the focus is set after the textarea is fully rendered
      requestAnimationFrame(() => {
        texteareaEl.focus()
      })
    }
  }

  calculateIsScrollOnBottom = () => {
    const scrollableHeight = this.messagesContainerRef.scrollHeight - this.messagesContainerRef.clientHeight

    return this.messagesContainerRef.scrollTop + BOTTOM_THRESHOLD >= scrollableHeight
  }

  scrollToBottom = (
    options: { animated: boolean; onScrollDone?: () => void } = { animated: true, onScrollDone: () => {} },
  ) => {
    if (!this.messagesContainerRef) {
      return
    }

    if (!options.animated) {
      this.messagesContainerRef.scrollTop = this.messagesContainerRef.scrollHeight
      options.onScrollDone()
      return
    }

    this.isScrolling = true
    const startTime = performance.now()
    const startPosition = this.messagesContainerRef.scrollTop

    const duration = 300 // Custom duration in milliseconds

    const animateScroll = (currentTime: number) => {
      if (!this.messagesContainerRef || !this.isScrolling) {
        return
      }
      const scrollTarget = this.messagesContainerRef.scrollHeight - this.messagesContainerRef.clientHeight
      const elapsedTime = currentTime - startTime
      const scrollProgress = Math.min(1, elapsedTime / duration)
      const easeFunction = this.easeInOutQuad(scrollProgress)
      const scrollTo = startPosition + (scrollTarget - startPosition) * easeFunction

      this.messagesContainerRef.scrollTo(0, scrollTo)

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll)
      } else {
        this.isScrolling = false
        options.onScrollDone()
      }
    }

    requestAnimationFrame(animateScroll)
  }

  // Easing function for smooth scroll animation
  easeInOutQuad = (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  recalculateGoBoToBottomButton = () => {
    const isContainerOverflowing = this.calculateIsContainerOverflowing()
    if (!isContainerOverflowing) {
      this.showGoToBottomButton = false
      return
    }

    this.showGoToBottomButton = !this.calculateIsScrollOnBottom()
  }

  handleWheel = (e: WheelEvent) => {
    const isContainerOverflowing = this.calculateIsContainerOverflowing()
    if (!isContainerOverflowing) {
      this.lockScrollOnBottom = false
      this.showGoToBottomButton = false
      return
    }

    // Get the current scroll position
    const currentScrollTop = this.messagesContainerRef.scrollTop

    this.showGoToBottomButton = !this.calculateIsScrollOnBottom()

    this.lockScrollOnBottom = !this.showGoToBottomButton
    if (!this.showGoToBottomButton) {
      this.isScrolling = false
    }

    // Update the previous scroll position
    this.prevScrollTop = currentScrollTop
  }

  setSources = () => {
    this.chatStore.state.sourceBaseURL = this.sourceBaseUrl
    this.chatStore.state.sourcesMap = {
      ...this.chatStore.state.sourcesMap,
      ...this.sourcesMap,
    }
    this.chatStore.state.linksTarget = this.linksTarget
    this.chatStore.state.linksRel = this.linksRel
  }

  componentDidLoad() {
    this.messagesContainerRef.addEventListener('wheel', this.handleWheel)
    this.setSources()
    this.handleFocus()

    if (this.prompt && this.chatStore.state?.prompt !== this.prompt) {
      this.triggerSendQuestion(this.prompt)
      this.chatStore.state.prompt = this.prompt
    }

    this.scrollableContainerResizeObserver = new ResizeObserver(() => {
      this.recalculateGoBoToBottomButton()
    })
    this.scrollableContainerResizeObserver.observe(this.messagesContainerRef)

    this.nonScrollableContainerResizeObserver = new ResizeObserver(() => {
      if (this.pendingNewInteractionSideEffects) {
        this.pendingNewInteractionSideEffects = false
        this.lockScrollOnBottom = false
        this.scrollToBottom({
          animated: true,
          onScrollDone: () => {
            this.recalculateGoBoToBottomButton()
          },
        })

        return
      }

      if (this.lockScrollOnBottom && !this.isScrolling) {
        this.scrollToBottom({
          animated: false,
          onScrollDone: () => {
            this.recalculateGoBoToBottomButton()
          },
        })
      }

      this.recalculateGoBoToBottomButton()
    })

    this.nonScrollableContainerResizeObserver.observe(this.nonScrollableMessagesContainerRef)
  }

  disconnectedCallback() {
    this.messagesContainerRef?.removeEventListener('wheel', this.handleWheel)
    this.scrollableContainerResizeObserver?.disconnect()
    this.nonScrollableContainerResizeObserver?.disconnect()

    if (this.clearChatOnDisconnect) {
      this.chatStore.state.interactions = []
    }
  }

  handleSubmit = (e: Event) => {
    e.preventDefault()

    if (this.chatStore.state.chatService === null) {
      throw new Error('Chat Service is not initialized')
    }

    this.startConversation.emit({ userPrompt: this.inputValue, systemPrompts: this.systemPrompts })

    this.chatStore.state.chatService.sendQuestion(this.inputValue, this.relatedQueries, this.systemPrompts, {
      onAnswerGeneratedCallback: (params) => this.answerGenerated.emit(params),
    })

    this.chatStore.state.prompt = this.inputValue
    this.inputValue = ''
  }

  handleAbortAnswerClick = () => {
    this.chatStore.state.chatService.abortAnswer()
  }

  handleSuggestionClick = (suggestion: string, relatedQueries?: number) => {
    if (this.chatStore.state.chatService === null) {
      throw new Error('Chat Service is not initialized')
    }

    this.startConversation.emit({ userPrompt: suggestion, systemPrompts: this.systemPrompts })

    this.chatStore.state.chatService.sendQuestion(suggestion, relatedQueries, undefined, {
      onAnswerGeneratedCallback: (params) => this.answerGenerated.emit(params),
    })
    this.inputValue = ''
  }

  handleClearChat = () => {
    this.chatStore.state.chatService.resetChat()
    this.clearChat.emit()
  }

  calculateIsContainerOverflowing = () => {
    if (!this.messagesContainerRef) {
      return false
    }

    return this.messagesContainerRef.scrollHeight > this.messagesContainerRef.clientHeight
  }

  render() {
    const lastInteraction = this.chatStore.state.interactions?.[this.chatStore.state.interactions.length - 1]
    const lastInteractionStatus = lastInteraction?.status
    const hasInteractions = this.chatStore.state.interactions?.length > 0

    // ? Question: Maybe should be a orama-button variant?
    return (
      <Host>
        {this.showClearChat && hasInteractions && (
          <div class="header">
            <button type="button" onClick={this.handleClearChat}>
              <ph-arrow-clockwise weight="fill" size="14" /> Clear chat
            </button>
          </div>
        )}
        {/* CHAT MESSAGES */}
        <div class={'messages-container-wrapper-non-scrollable'}>
          <div
            class={`messages-container-wrapper ${!hasInteractions ? 'isEmpty' : ''}`}
            ref={(ref) => (this.messagesContainerRef = ref)}
          >
            <div ref={(ref) => (this.nonScrollableMessagesContainerRef = ref)}>
              {hasInteractions ? (
                <orama-chat-messages-container
                  interactions={this.chatStore.state.interactions}
                  chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
                  chatMarkdownLinkHref={this.chatMarkdownLinkHref}
                />
              ) : null}

              {/* TODO: Provide a better animation */}
              {!hasInteractions ? (
                <Fragment>
                  <slot name="chat-empty-state" />
                  {!!this.suggestions?.length && (
                    <div class="suggestions-wrapper">
                      <orama-suggestions
                        suggestions={this.suggestions}
                        suggestionClicked={this.handleSuggestionClick}
                      />
                    </div>
                  )}
                </Fragment>
              ) : null}
              {/* TODO: not required for chatbox, but maybe required for Searchbox v2 */}
              {/* <orama-logo-icon /> */}
            </div>
          </div>
          {this.showGoToBottomButton && (
            <button
              class="lock-scroll-on-bottom-button-wrapper"
              type="button"
              onClick={() => {
                this.lockScrollOnBottom = true
                this.scrollToBottom({ animated: true, onScrollDone: () => this.recalculateGoBoToBottomButton() })
              }}
            >
              <ph-arrow-down size={'18px'} />
            </button>
          )}
        </div>

        {/* CHAT INPUT */}
        <div class="chat-form-wrapper">
          <form onSubmit={this.handleSubmit}>
            <div class="chat-input">
              <orama-textarea
                ref={(ref) => (this.textareaRef = ref)}
                autoFocus={this.focusInput}
                maxRows={4}
                value={this.inputValue}
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    this.handleSubmit(e)
                    e.preventDefault()
                  }
                }}
                onInput={(e: Event) => {
                  this.inputValue = (e.target as HTMLInputElement).value
                }}
                placeholder={this.placeholder}
              >
                <div slot="adornment-end">
                  {[TAnswerStatus.streaming, TAnswerStatus.rendering, TAnswerStatus.loading].includes(
                    lastInteractionStatus,
                  ) ? (
                    <orama-button
                      type="submit"
                      onClick={this.handleAbortAnswerClick}
                      onKeyDown={this.handleAbortAnswerClick}
                      disabled={lastInteractionStatus !== TAnswerStatus.rendering}
                      aria-label="Abort answer"
                    >
                      <ph-stop-circle size={16} />
                    </orama-button>
                  ) : (
                    <orama-button
                      type="submit"
                      onClick={this.handleSubmit}
                      onKeyDown={this.handleSubmit}
                      disabled={!this.inputValue}
                      aria-label="Send question"
                    >
                      <ph-paper-plane-tilt size={16} />
                    </orama-button>
                  )}
                </div>
              </orama-textarea>
            </div>
          </form>
          <orama-text as="p" styledAs="small" align="center">
            Orama can make mistakes. Please verify the information.
          </orama-text>
        </div>
      </Host>
    )
  }
}
