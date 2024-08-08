import { Component, Host, h } from '@stencil/core'
import { globalContext } from '@/context/GlobalContext'

@Component({
  tag: 'orama-search-button',
  styleUrl: 'orama-search-button.scss',
  scoped: true,
})
export class SearchButton {
  render() {
    return (
      <Host>
        <button
          type="button"
          onClick={() => {
            globalContext.open = !globalContext.open
          }}
        >
          Toggle
        </button>
      </Host>
    )
  }
}
