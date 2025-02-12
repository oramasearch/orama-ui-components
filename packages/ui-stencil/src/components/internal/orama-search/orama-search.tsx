import { Component, Host, Listen, State, Watch, h, Element, Prop, type EventEmitter, Event } from '@stencil/core'
import type { OnAnswerGeneratedCallbackProps, OnSearchCompletedCallbackProps, SearchResult } from '@/types'
import type { HighlightOptions } from '@orama/highlight'
import { Store } from '@/StoreDecorator'
import type { SearchStoreType } from '@/ParentComponentStore/SearchStore'
import type { GlobalStoreType } from '@/ParentComponentStore/GlobalStore'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'

@Component({
  tag: 'orama-search',
  styleUrl: 'orama-search.scss',
  scoped: true,
})
export class OramaSearch {
  @Element() el: HTMLElement

  @Prop() placeholder?: string = 'Search...'
  @Prop() focusInput?: boolean = false
  @Prop() suggestions?: string[] = []
  @Prop() sourceBaseUrl?: string
  @Prop() linksTarget?: string
  @Prop() linksRel?: string
  @Prop() disableChat?: boolean = false
  @Prop() highlightTitle?: HighlightOptions | false = false
  @Prop() highlightDescription?: HighlightOptions | false = false

  @State() searchValue = ''
  @State() selectedFacet = ''

  @Event({ bubbles: true, composed: true }) searchCompleted: EventEmitter<OnSearchCompletedCallbackProps>
  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>

  inputRef!: HTMLOramaInputElement

  @Store('search')
  private searchStore: SearchStoreType
  @Store('global')
  private globalStore: GlobalStoreType
  @Store('chat')
  private chatStore: ChatStoreType

  @Watch('searchValue')
  @Watch('selectedFacet')
  handleSearchValueChange() {
    this.searchStore.state.searchService.search(this.searchValue, this.selectedFacet, {
      onSearchCompletedCallback: (onSearchCompletedCallbackProps) => {
        this.searchCompleted.emit(onSearchCompletedCallbackProps)
      },
    })
    this.globalStore.state.currentTerm = this.searchValue
  }

  @Listen('oramaItemClick')
  handleOramaItemClick(event: CustomEvent<SearchResult>) {
    // console.log(`Item clicked: ${event.detail.title}`, event.detail)
  }

  onSelectedFacetChangedHandler = (facetName: string) => {
    this.selectedFacet = facetName
  }

  onInputChange = (e: Event) => {
    this.searchValue = (e.target as HTMLInputElement).value
  }

  handleSubmit = (e: Event) => {
    e.preventDefault()

    if (this.disableChat) {
      return
    }

    const chatButton = this.el.querySelector('orama-chat-button') as HTMLElement
    chatButton?.click()
  }

  render() {
    return (
      <Host>
        <form onSubmit={this.handleSubmit} class="search-form">
          <orama-input
            focus-on-arrow-nav
            autoFocus={this.focusInput}
            type="search"
            onInput={this.onInputChange}
            size="large"
            labelForScreenReaders={this.placeholder}
            placeholder={this.placeholder}
            onResetValue={() => {
              this.searchValue = ''
            }}
          />
          <slot name="summary" />
        </form>
        <div class="result-wrapper">
          <orama-facets
            facets={this.searchStore.state.facets}
            selectedFacet={this.selectedFacet}
            selectedFacetChanged={this.onSelectedFacetChangedHandler}
          />
          <orama-search-results
            suggestions={!this.globalStore.state.currentTerm?.length && !this.disableChat ? this.suggestions : []}
            setChatTerm={(term) => {
              this.globalStore.state.currentTask = 'chat'
              this.chatStore.state.chatService?.sendQuestion(term, undefined, {
                onAnswerGeneratedCallback: (onAnswerGeneratedCallbackProps) =>
                  this.answerGenerated.emit(onAnswerGeneratedCallbackProps),
              })
            }}
            sourceBaseUrl={this.sourceBaseUrl}
            linksTarget={this.linksTarget}
            linksRel={this.linksRel}
            sections={this.searchStore.state.results}
            searchTerm={this.searchValue}
            highlightTitle={this.highlightTitle}
            highlightDescription={this.highlightDescription}
            loading={this.searchStore.state.loading}
            error={this.searchStore.state.error}
          />
        </div>
      </Host>
    )
  }
}
