import type { TChatInteraction } from '@/types'
import { Component, Host, Prop, h } from '@stencil/core'

@Component({
  tag: 'orama-chat-user-message',
  styleUrl: 'orama-chat-user-message.scss',
  scoped: true,
})
export class OramaChatUserMessage {
  @Prop() interaction: TChatInteraction

  render() {
    return (
      <Host>
        <div class="message-wrapper">
          <orama-text as="h2" styledAs="p" class="chat-question">
            {this.interaction.query}
          </orama-text>
        </div>
      </Host>
    )
  }
}
