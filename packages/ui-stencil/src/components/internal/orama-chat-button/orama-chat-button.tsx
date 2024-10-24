import { Component, Prop, h, Element, Host, Watch } from '@stencil/core'
import { Icon } from '@/components/internal/icons'
import { getNonExplicitAttributes } from '@/utils/utils'
import '@phosphor-icons/webcomponents/dist/icons/PhArrowBendDownLeft.mjs'

@Component({
  tag: 'orama-chat-button',
  styleUrl: 'orama-chat-button.scss',
  scoped: true,
})
// TODO: consider renaming this component
/**
 * The orama-chat-button component is used to render a button element that will trigger the chat.
 */
export class OramaChatButton {
  @Element() el: HTMLButtonElement

  @Prop() label: string
  @Prop() active?: boolean = false
  @Prop() highlight?: boolean = false
  @Prop() class?: string

  @Watch('active')
  @Watch('highlight')
  highlightButton() {
    if (this.active && !this.highlight) {
      this.highlight = true
    }
  }

  render() {
    const declaredProps = ['label', 'onClick', 'class']
    const buttonProps = getNonExplicitAttributes(this.el, declaredProps)

    return (
      <Host class={this.class}>
        <button
          class={{
            'chat-button': true,
            'is-active': this.active,
            'is-highlighted': this.highlight,
          }}
          {...buttonProps}
          type="button"
        >
          <span class="icon-star">
            <Icon name="star" size={16} />
          </span>
          <span class="button-label">{this.label}</span>
          <span class="icon-enter">
            <ph-arrow-bend-down-left size={12} />
          </span>
        </button>
      </Host>
    )
  }
}
