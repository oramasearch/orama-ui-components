import { Component, Host, Prop, h } from '@stencil/core'
import '@phosphor-icons/webcomponents/dist/icons/PhMagnifyingGlass.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhSparkle.mjs'
import { Store } from '@/StoreDecorator'
import type { GlobalStoreType } from '@/ParentComponentStore/GlobalStore'

@Component({
  tag: 'orama-toggler',
  styleUrl: 'orama-toggler.scss',
  scoped: true,
})
export class OramaToggler {
  @Prop() performInitialAnimation = false
  private firstRender = true

  @Store('global')
  private globalStore: GlobalStoreType

  componentWillLoad() {
    if (this.performInitialAnimation) {
      this.firstRender = false
    }
  }

  componentDidLoad() {
    if (this.firstRender) {
      this.firstRender = false
    }
  }

  render() {
    return (
      <Host>
        <button
          type="button"
          class={{
            selected: this.globalStore.state.currentTask === 'search',
            animate: !this.firstRender || this.performInitialAnimation,
          }}
          onClick={() => (this.globalStore.state.currentTask = 'search')}
        >
          <span>Search</span>
          <ph-magnifying-glass size={16} />
        </button>
        <button
          type="button"
          class={{
            selected: this.globalStore.state.currentTask === 'chat',
            animate: !this.firstRender || this.performInitialAnimation,
          }}
          onClick={() => (this.globalStore.state.currentTask = 'chat')}
        >
          <ph-sparkle size={16} />
          <span>Ask AI</span>
        </button>
      </Host>
    )
  }
}
