import { Component, Fragment, Host, Prop, h } from '@stencil/core'
import '@phosphor-icons/webcomponents/dist/icons/PhClock.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhPlus.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhCaretLeft.mjs'
import type { ChatStoreType } from '@/context/Context'
import { Store } from '@/StoreDecorator'

@Component({
  tag: 'orama-navigation-bar',
  styleUrl: 'orama-navigation-bar.scss',
  scoped: true,
})
export class OramaNavigationBar {
  @Prop() handleClose: () => void
  @Prop() showBackButton = true
  @Prop() showChatActions = false

  @Store('chat')
  private chatStore: ChatStoreType

  // TODO: maybe better to make this component context agnostic
  private handleStartNewChat = () => {
    this.chatStore.state.chatService?.resetChat()
  }

  render() {
    return (
      <Host>
        <div class="corner-section start">
          {this.showBackButton ? (
            <Fragment>
              <orama-button
                type="button"
                variant="icon"
                aria-label="Exit"
                onClick={this.handleClose}
                onKeyDown={this.handleClose}
              >
                <ph-caret-left size="20px" />
              </orama-button>
            </Fragment>
          ) : (
            <div class="spacer" />
          )}
        </div>
        <div class="corner-section center">
          <orama-toggler />
        </div>
        <div class="corner-section end">
          {this.showChatActions ? (
            <Fragment>
              {/*
                <orama-button type="button" variant="icon" aria-label="View history">
                  <ph-clock size="20px" />
                </orama-button> 
              */}
              <orama-button
                type="button"
                variant="icon"
                aria-label="Start new chat"
                onClick={this.handleStartNewChat}
                onKeyDown={this.handleStartNewChat}
              >
                <ph-plus size="20px" />
              </orama-button>
            </Fragment>
          ) : (
            <div class="spacer" />
          )}
        </div>
      </Host>
    )
  }
}
