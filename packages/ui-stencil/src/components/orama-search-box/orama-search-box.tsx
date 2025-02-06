import { Component, Prop, Watch, h, Listen, Element, State, Fragment, Event, type EventEmitter } from '@stencil/core'
import { searchState } from '@/context/searchContext'
import { chatContext } from '@/context/chatContext'
import { globalContext, globalStore } from '@/context/GlobalContext'
import { ChatService } from '@/services/ChatService'
import { SearchService } from '@/services/SearchService'
import { windowWidthListener } from '@/services/WindowService'
import { arrowKeysNavigation, generateRandomID, initOramaClient, updateCssVariables, updateThemeClasses, validateCloudIndexConfig } from '@/utils/utils'
import type { AnyOrama, Orama, SearchParams } from '@orama/orama'
import type { HighlightOptions } from '@orama/highlight'
import type { OramaClient } from '@oramacloud/client'
import type {
  ChatMarkdownLinkHref,
  ChatMarkdownLinkTarget,
  ChatMarkdownLinkTitle,
  CloudIndexConfig,
  ColorScheme,
  OnAnswerGeneratedCallbackProps,
  OnAnswerSourceClickCallbackProps,
  OnChatMarkdownLinkClickedCallbackProps,
  OnSearchCompletedCallbackProps,
  OnSearchResultClickCallbackProps,
  ResultItemRenderFunction,
  ResultMap,
  SourcesMap,
} from '@/types'
import type { TThemeOverrides } from '@/config/theme'

// TODO: AI components should be lazyly loaded. In case of Disable AI flag, it should not be loaded at all
// https://linear.app/oramasearch/issue/ORM-1824/ai-components-should-be-lazyly-loaded-in-case-of-disable-ai-flag-they

@Component({
  tag: 'orama-search-box',
  styleUrl: 'orama-search-box.scss',
  shadow: true,
})
export class SearchBox {
  @Element() htmlElement!: HTMLElement

  /**
   * Component theme customization
   */
  @Prop() themeConfig?: Partial<TThemeOverrides>
  /**
   * Component color schema
   */
  @Prop() colorScheme?: ColorScheme = 'light'
  /**
   * Orama Index configuration
   *
   * note: It will be overrided by clientInstance property
   */
  @Prop() index?: CloudIndexConfig | CloudIndexConfig[]
  /**
   * Orama Instance
   */
  @Prop() clientInstance?: OramaClient | AnyOrama
  @Prop({ mutable: true }) open = false
  /**
   * Index result property to
   */
  @Prop() facetProperty?: string
  /**
   * Used to map dataset result properties to the expected SearchBox properties
   */
  @Prop() resultMap?: Partial<ResultMap> = {}
  /**
   * Used to render a custom icom per result. It should return a local asset path.
   */
  @Prop() resultItemRender?: ResultItemRenderFunction
  /**
   * Used to provide source base URL for the Search Results
   */
  @Prop() sourceBaseUrl?: string
  /**
   * Used to provide linkRel to search result links
   */
  @Prop() linksTarget?: string
  /**
   * Used to provide linkRel to search result links
   */
  @Prop() linksRel?: string
  /**
   * Used to map Chat result sources to expected Orama Chat properties
   */
  @Prop() sourcesMap?: SourcesMap
  /**
   * Disables chat capabilities
   */
  @Prop() disableChat?: boolean = false
  /**
   * This component can behave either as Modal or a Embed component.
   * For Modal, a new absolute panel will be displayed on top.
   * For Embed, Orama Search Box will be displayed as a inline component.
   */
  @Prop() layout?: 'modal' | 'embed' = 'modal'
  /**
   * Options for highlights of Search Result titles
   */
  @Prop() highlightTitle?: HighlightOptions | false = false
  /**
   * Options for highlights of Search Result descriptions
   */
  @Prop() highlightDescription?: HighlightOptions | false = false
  /**
   * @deprecated it will be removed on next releases
   * Placeholder for chat input
   */
  @Prop() placeholder?: string
  /**
   * Placeholder for chat input
   */
  @Prop() chatPlaceholder?: string
  /**
   * Placeholder for search input
   */
  @Prop() searchPlaceholder?: string
  /**
   * List of initial questions for Orama Chat
   */
  @Prop() suggestions?: string[]
  /**
   * Parameters forwarded to Orama Client.
   */
  @Prop() searchParams?: SearchParams<Orama<AnyOrama | OramaClient>>
  /**
   * Callback function used on every AI Chat link title
   */
  @Prop() chatMarkdownLinkTitle?: ChatMarkdownLinkTitle
  /**
   * Callback function used on every AI Chat link
   */
  @Prop() chatMarkdownLinkHref?: ChatMarkdownLinkHref
  /**
   * Callback function used on every AI Chat link target
   */
  @Prop() chatMarkdownLinkTarget?: ChatMarkdownLinkTarget

  @State() componentID = generateRandomID('search-box')
  @State() systemScheme: Omit<ColorScheme, 'system'> = 'light'
  @State() windowWidth: number

  /**
   * Fired when search successfully resolves
   */
  @Event({ bubbles: true, composed: true }) searchCompleted: EventEmitter<OnSearchCompletedCallbackProps>
  /**
   * Fired when user clicks on search result
   */
  @Event({ bubbles: true, composed: true, cancelable: true })
  searchResultClick: EventEmitter<OnSearchResultClickCallbackProps>
  /**
   * Fired when answer generation is successfully completed
   */
  @Event({ bubbles: true, composed: true }) answerGenerated: EventEmitter<OnAnswerGeneratedCallbackProps>
  /**
   * Fired when user clicks on answer source
   */
  @Event({ bubbles: true, composed: true, cancelable: true })
  answerSourceClick: EventEmitter<OnAnswerSourceClickCallbackProps>
  /**
   * Fired when user clicks on chat markdown link
   */
  @Event({ bubbles: true, composed: true, cancelable: true })
  chatMarkdownLinkClicked: EventEmitter<OnChatMarkdownLinkClickedCallbackProps>

  wrapperRef!: HTMLElement

  schemaQuery: MediaQueryList

  @Watch('index')
  @Watch('clientInstance')
  indexChanged() {
    this.startServices()
  }

  @Watch('themeConfig')
  @Watch('colorScheme')
  watchHandler() {
    this.updateTheme()
  }

  @Watch('open')
  handleOpenPropChange(newValue: boolean) {
    globalContext.open = newValue
  }

  @Watch('facetProperty')
  handleFacetPropertyChange(newValue: string) {
    searchState.facetProperty = newValue
  }

  @Watch('searchParams')
  handleSearchParamsChange(newValue: SearchParams<Orama<AnyOrama | OramaClient>>) {
    searchState.searchParams = newValue
  }

  @Listen('modalStatusChanged')
  modalStatusChangedHandler(event: CustomEvent<{ open: boolean; id: HTMLElement }>) {
    if (event.detail.id === this.wrapperRef) {
      if (!event.detail.open) {
        globalContext.open = false
        this.open = false
      }
    }
  }

  @Listen('keydown', { target: 'document' })
  handleKeyDown(ev: KeyboardEvent) {
    if (
      globalContext.currentTask === 'search' &&
      ((this.layout === 'modal' && this.open) || this.layout === 'embed') &&
      ['ArrowDown', 'ArrowUp'].includes(ev.key)
    ) {
      arrowKeysNavigation(this.wrapperRef, ev)
    }
  }

  updateTheme() {
    const scheme = updateThemeClasses(
      this.htmlElement,
      this.colorScheme,
      this.systemScheme
    )

    updateCssVariables(
        this.htmlElement,
        scheme as ColorScheme,
        this.themeConfig
    )
  }

  startServices() {
    validateCloudIndexConfig(this.htmlElement, this.index, this.clientInstance)
    const oramaClient = this.clientInstance ? this.clientInstance : initOramaClient(this.index)

    searchState.searchService = new SearchService(oramaClient)
    chatContext.chatService = new ChatService(oramaClient)
  }

  componentWillLoad() {
    // TODO: We probable want to keep these props below whithin the respective service
    // instance property. I seems to make sense to pass it as initialization prop.
    // Same goes for any other Chat init prop. Lets talk about it as well, please.
    searchState.facetProperty = this.facetProperty
    searchState.resultMap = this.resultMap
    searchState.searchParams = this.searchParams

    this.htmlElement.id = this.componentID
    this.startServices()
  }

  connectedCallback() {
    this.windowWidth = windowWidthListener.width
    globalContext.open = this.open

    globalStore.onChange('open', () => {
      this.open = globalContext.open

      if (!globalContext.open) {
        globalContext.currentTerm = ''

        // TODO: We should be reseting the context, but we do not want to lose params definitions.
        // We may want to handle params in a different way.
        searchState.facets = []
        searchState.count = 0
        searchState.results = []
        searchState.highlightedIndex = -1
        searchState.loading = false
        searchState.error = false

        chatContext.interactions = []
      }
    })

    this.htmlElement.id = this.componentID
    this.schemaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemScheme = this.schemaQuery.matches ? 'dark' : 'light'
    this.updateTheme()

    this.schemaQuery.addEventListener('change', this.onPrefersColorSchemeChange)
    windowWidthListener.addEventListener('widthChange', this.updateWindowWidth)
  }

  disconnectedCallback() {
    windowWidthListener.removeEventListener('widthChange', this.updateWindowWidth)
    this.schemaQuery?.removeEventListener('change', this.onPrefersColorSchemeChange)
  }

  getSearchBox() {
    return (
      <div
        class={`${
          this.windowWidth > 1024
            ? 'section-active'
            : globalContext.currentTask === 'search'
              ? 'section-active'
              : 'section-inactive'
        }`}
      >
        <orama-search
          placeholder={this?.searchPlaceholder || 'Search...'}
          focusInput={globalContext.currentTask === 'search'}
          sourceBaseUrl={this.sourceBaseUrl}
          linksTarget={this.linksTarget}
          linksRel={this.linksRel}
          highlightTitle={this.highlightTitle}
          highlightDescription={this.highlightDescription}
          disableChat={this.disableChat}
          suggestions={this.suggestions}
        >
          {this.windowWidth > 1024 && !this.disableChat && (
            <orama-chat-button
              slot="summary"
              focus-on-arrow-nav
              active={!!globalContext.currentTerm}
              label={`${globalContext.currentTerm ? `${globalContext.currentTerm} - ` : ''}Get a summary`}
              onClick={this.onChatButtonClick}
              onKeyPress={this.onChatButtonClick}
            />
          )}
        </orama-search>
      </div>
    )
  }

  getChatBox() {
    return (
      <Fragment>
        <orama-chat
          class={`${globalContext.currentTask === 'chat' ? 'section-active' : 'section-inactive'}`}
          defaultTerm={globalContext.currentTask === 'chat' ? globalContext.currentTerm : ''}
          showClearChat={false}
          focusInput={globalContext.currentTask === 'chat'}
          placeholder={this?.chatPlaceholder || this.placeholder}
          sourceBaseUrl={this.sourceBaseUrl}
          linksTarget={this.linksTarget}
          linksRel={this.linksRel}
          sourcesMap={this.sourcesMap}
          suggestions={this.suggestions}
          chatMarkdownLinkTitle={this.chatMarkdownLinkTitle}
          chatMarkdownLinkHref={this.chatMarkdownLinkHref}
        />
      </Fragment>
    )
  }

  getInnerContent() {
    return (
      <Fragment>
        {this.disableChat ? null : (
          <orama-navigation-bar
            handleClose={this.closeSearchbox}
            showBackButton={this.layout !== 'embed'}
            showChatActions={globalContext.currentTask === 'chat'}
          />
        )}
        <div class="main">
          {this.getSearchBox()}
          {this.windowWidth <= 1024 && this.getChatBox()}
        </div>
        <orama-footer colorScheme={this.colorScheme === 'system' ? this.systemScheme : this.colorScheme} />
      </Fragment>
    )
  }

  getOuterContent() {
    return this.windowWidth > 1024 ? (
      <orama-sliding-panel
        open={globalContext.currentTask === 'chat'}
        backdrop={this.layout === 'embed'}
        closed={() => {
          globalContext.currentTask = 'search'
        }}
      >
        {this.getChatBox()}
      </orama-sliding-panel>
    ) : null
  }

  getModalLayout() {
    return (
      <Fragment>
        <orama-modal
          ref={(el) => (this.wrapperRef = el)}
          open={globalContext.open}
          class="modal"
          mainTitle="Start your search"
          closeOnEscape={globalContext.currentTask === 'search' || this.windowWidth <= 1024}
        >
          {this.getInnerContent()}
        </orama-modal>
        {this.getOuterContent()}
      </Fragment>
    )
  }

  getEmbedLayout() {
    return (
      <Fragment>
        <orama-embed ref={(el) => (this.wrapperRef = el)}>{this.getInnerContent()}</orama-embed>
        {this.getOuterContent()}
      </Fragment>
    )
  }

  render() {
    if (this.layout === 'modal' && !globalContext.open) {
      return null
    }

    if (!searchState.searchService) {
      return <orama-text as="p">Unable to initialize search service</orama-text>
    }

    if (!chatContext.chatService) {
      return <orama-text as="p">Unable to initialize chat service</orama-text>
    }

    return this.layout === 'modal' ? this.getModalLayout() : this.getEmbedLayout()
  }

  private closeSearchbox = () => {
    globalContext.open = false
    this.open = false
  }

  private onChatButtonClick = () => {
    globalContext.currentTask = 'chat'
  }

  private onPrefersColorSchemeChange = (event) => {
    this.systemScheme = event.matches ? 'dark' : 'light'
    this.updateTheme()
  }

  private updateWindowWidth = (event: CustomEvent) => {
    this.windowWidth = event.detail
  }
}
