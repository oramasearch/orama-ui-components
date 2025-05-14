import { Component, Host, Prop, h, Element, State, type EventEmitter, Event } from '@stencil/core'
import type {
  ChatMarkdownLinkHref,
  ChatMarkdownLinkTarget,
  ChatMarkdownLinkTitle,
  OnAnswerGeneratedCallbackProps,
  OnSearchCompletedCallbackProps,
  TChatInteraction,
} from '@/types'
import { Store } from '@/StoreDecorator'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

@Component({
  tag: 'orama-chat-messages-container',
  styleUrl: 'orama-chat-messages-container.scss',
  scoped: true,
})
export class OramaChatMessagesContainer {
  @Prop() interactions: TChatInteraction[]
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>

  @Element() el: HTMLElement

  @State() latestInteractionMinHeight = 0

  @Store('chat')
  private chatStore: ChatStoreType

  // TODO: I'm not sure about having this here as we're breaking our rule of maintain service access only to the very top level component
  onSuggestionClick = (suggestion: string) => {
    this.chatStore.state.chatService?.sendQuestion(suggestion, undefined, undefined, {
      onAnswerGeneratedCallback: (onAnswerGeneratedCallbackProps) =>
        this.answerGenerated.emit(onAnswerGeneratedCallbackProps),
    })
  }

  resizeObserver = new ResizeObserver((entries) => {
    // FIXME: We are removing the margin with a constant value. It should be calculated
    this.latestInteractionMinHeight = entries[0].target.clientHeight - 32
  })

  componentDidLoad() {
    // FIXME: We should get the element in another way. I tried findById or class and it was not working.
    // probable something related to the shadow dom
    const messagesWrapperElement = this.el.parentElement.parentElement

    this.resizeObserver.observe(messagesWrapperElement)
  }

  render() {
    return (
      <Host>
        <div class="messages-container">
          {this.interactions.map((interaction, interactionIndex) => (
            <div
              key={interaction.interactionId}
              class="interaction-wrapper"
              // Hack to put the message on top when auto scrolling
              style={{
                minHeight:
                  this.interactions.length > 1 && interactionIndex === this.interactions.length - 1
                    ? `${this.latestInteractionMinHeight}px`
                    : '0px',
              }}
            >
              <orama-chat-user-message interaction={{ ...interaction }} />
              <orama-chat-assistent-message
                interaction={{ ...interaction }}
                chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
                chatMarkdownLinkHref={this.chatMarkdownLinkHref}
              />
              {interaction.latest && interaction.status === 'done' && !!interaction.relatedQueries?.length && (
                <div class="suggestions-wrapper">
                  <orama-suggestions
                    as="chips"
                    suggestions={interaction.relatedQueries}
                    suggestionClicked={this.onSuggestionClick}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Host>
    )
  }
}
