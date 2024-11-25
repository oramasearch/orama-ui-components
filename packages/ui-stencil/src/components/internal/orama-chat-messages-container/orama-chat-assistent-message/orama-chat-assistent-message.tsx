import { Component, Host, Prop, State, h } from '@stencil/core'
import type { TChatInteraction } from '@/context/chatContext'
import '@phosphor-icons/webcomponents/dist/icons/PhCopy.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowsClockwise.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhThumbsDown.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhWarning.mjs'
import { chatContext, TAnswerStatus } from '@/context/chatContext'
import { copyToClipboard } from '@/utils/utils'
import type { ChatMarkdownLinkHref, ChatMarkdownLinkTitle } from '@/types'

@Component({
  tag: 'orama-chat-assistent-message',
  styleUrl: 'orama-chat-assistent-message.scss',
  scoped: true,
})
export class OramaChatAssistentMessage {
  @Prop() interaction: TChatInteraction
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref

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

  private handleRetryMessage = () => {
    chatContext.chatService?.regenerateLatest()
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

    return (
      <Host>
        <orama-sources
          sources={this.interaction.sources}
          sourceBaseURL={chatContext.sourceBaseURL}
          sourcesMap={chatContext.sourcesMap}
          linksRel={chatContext.linksRel}
          linksTarget={chatContext.linksTarget}
        />
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
