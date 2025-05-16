import { Component, Host, Listen, State, Watch, h, Element, Prop, type EventEmitter, Event } from '@stencil/core'
import type { OnAnswerGeneratedCallbackProps, OnSearchCompletedCallbackProps, SearchResult, Dictionary } from '@/types'
import type { HighlightOptions } from '@orama/highlight'
import { Store } from '@/StoreDecorator'
import type { SearchStoreType } from '@/ParentComponentStore/SearchStore'
import type { GlobalStoreType } from '@/ParentComponentStore/GlobalStore'
import type { ChatStoreType } from '@/ParentComponentStore/ChatStore'
import { defaultTextDictionary, getText as getTextUtil } from '@/utils/textDictionary'

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
  @Prop() relatedQueries?: number
  @Prop() highlightTitle?: HighlightOptions | false = false
  @Prop() highlightDescription?: HighlightOptions | false = false
  @Prop() dictionary?: Partial<Dictionary>

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

  /**
   * Gets the text for a specific key from the dictionary prop.
   * Prioritizes direct props (placeholder) for backward compatibility,
   * then falls back to the dictionary prop, and finally to the defaultTextDictionary.
   *
   * @param key - The key to get the text for
   * @returns The text for the specified key
   */
  getText(key: keyof Dictionary): string {
    // Create a map of direct props for backward compatibility
    const directProps: Partial<Record<keyof Dictionary, string>> = {
      searchPlaceholder: this.placeholder,
    }

    return getTextUtil(key, this.dictionary, directProps)
  }

  doSearch() {
    this.searchStore.state.searchService.search(this.globalStore.state.currentTerm, this.selectedFacet, {
      onSearchCompletedCallback: (onSearchCompletedCallbackProps) => {
        this.searchCompleted.emit(onSearchCompletedCallbackProps)
      },
    })
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
            onInput={(e) => {
              const target = e.target as HTMLInputElement
              this.globalStore.state.currentTerm = target.value

              this.doSearch()
            }}
            value={this.globalStore.state.currentTerm}
            size="large"
            labelForScreenReaders={this.getText('searchPlaceholder')}
            placeholder={this.getText('searchPlaceholder')}
          />
          <slot name="summary" />
        </form>
        <div class="result-wrapper">
          <orama-facets
            facets={this.searchStore.state.facets}
            selectedFacet={this.selectedFacet}
            selectedFacetChanged={(facetName) => {
              this.selectedFacet = facetName

              this.doSearch()
            }}
          />
          <orama-search-results
            suggestions={!this.globalStore.state.currentTerm?.length && !this.disableChat ? this.suggestions : []}
            setChatTerm={(term) => {
              this.globalStore.state.currentTask = 'chat'
              this.chatStore.state.chatService?.sendQuestion(term, this.relatedQueries, undefined, {
                onAnswerGeneratedCallback: (onAnswerGeneratedCallbackProps) =>
                  this.answerGenerated.emit(onAnswerGeneratedCallbackProps),
              })
            }}
            sourceBaseUrl={this.sourceBaseUrl}
            linksTarget={this.linksTarget}
            linksRel={this.linksRel}
            sections={this.searchStore.state.results}
            searchTerm={this.globalStore.state.currentTerm}
            highlightTitle={this.highlightTitle}
            highlightDescription={this.highlightDescription}
            loading={this.searchStore.state.loading}
            error={this.searchStore.state.error}
            dictionary={this.dictionary}
          />
        </div>
      </Host>
    )
  }
}
