import { Component, Host, Prop, State, Element, h } from '@stencil/core'
import '@phosphor-icons/webcomponents/dist/icons/PhCopy.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowsClockwise.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhThumbsDown.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhWarning.mjs'
import { copyToClipboard } from '@/utils/utils'
import {
  TAnswerStatus,
  type TChatInteraction,
  type ChatMarkdownLinkHref,
  type ChatMarkdownLinkTarget,
  type ChatMarkdownLinkTitle,
} from '@/types'
import { Store } from '@/StoreDecorator'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

@Component({
  tag: 'orama-chat-assistent-message',
  styleUrl: 'orama-chat-assistent-message.scss',
  scoped: true,
})
export class OramaChatAssistentMessage {
  @Element() htmlElement
  @Prop() interaction: TChatInteraction
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @State() isCopied = false
  handleCopyToClipboard = () => {
    this.isCopied = true
    setTimeout(() => (this.isCopied = false), 1000)
    copyToClipboard(this.interaction.response)
  }

  @State() isDisliked = false
  handleDislikeMessage = () => {
    // todo: replace with actual dislike logic
    this.isDisliked = !this.isDisliked
  }

  @Store('chat')
  private chatStore: ChatStoreType

  private handleRetryMessage = () => {
    this.chatStore.state.chatService?.regenerateLatest()
  }

  render() {
    if (this.interaction.status === 'loading') {
      return (
        <div class="message-wrapper">
          <orama-dots-loader />
        </div>
      )
    }
    if (this.interaction.status === 'error') {
      return (
        <div class="message-error">
          <ph-warning size={16} />
          <orama-text styledAs="span" inactive>
            An error occurred while trying to search. Please try again.
          </orama-text>
        </div>
      )
    }

    console.log(this.interaction)

    return (
      <Host>
        <orama-sources
          sources={this.interaction.sources}
          sourceBaseURL={this.chatStore.state.sourceBaseURL}
          sourcesMap={this.chatStore.state.sourcesMap}
          linksRel={this.chatStore.state.linksRel}
          linksTarget={this.chatStore.state.linksTarget}
        />

        {/* Show plan messages if they exist */}
        {this.interaction.plan?.map((planStep, index) => (
          <div class="message-wrapper plan-message" key={index}>
            <orama-text styledAs="span" bold>
              Step {index + 1}: {planStep.step}
            </orama-text>
            <orama-text styledAs="span">
              {planStep.description}
            </orama-text>
          </div>
        ))}

        {/* Show response message */}
        <div class="message-wrapper">
          {!this.interaction.response ? (
            <orama-dots-loader />
          ) : (
            <orama-markdown
              content={this.interaction.response}
              chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
              chatMarkdownLinkHref={this.chatMarkdownLinkHref}
            />
          )}

          <div class={{ 'message-actions': true, hidden: this.interaction.status !== TAnswerStatus.done }}>
            {this.interaction.latest && (
              <orama-button
                type="button"
                variant="icon"
                onClick={this.handleRetryMessage}
                onKeyDown={this.handleRetryMessage}
                aria-label="Retry message"
              >
                <ph-arrows-clockwise size="16px" />
              </orama-button>
            )}
            <orama-button
              type="button"
              variant="icon"
              onClick={this.handleCopyToClipboard}
              onKeyDown={this.handleCopyToClipboard}
              withTooltip={this.isCopied ? 'Copied!' : undefined}
              aria-label="Copy message"
            >
              <ph-copy size="16px" />
            </orama-button>
            <orama-button
              type="button"
              variant="icon"
              onClick={this.handleDislikeMessage}
              onKeyDown={this.handleDislikeMessage}
              aria-label="Dislike message"
            >
              {this.isDisliked ? <ph-thumbs-down weight="fill" size="16px" /> : <ph-thumbs-down size="16px" />}
            </orama-button>
          </div>
        </div>
      </Host>
    )
  }
}
