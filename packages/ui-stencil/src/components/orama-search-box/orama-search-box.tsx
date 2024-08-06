import { Component, Prop, Watch, h, Listen, Element, State, Fragment } from '@stencil/core'
import { searchState } from '@/context/searchContext'
import { chatContext } from '@/context/chatContext'
import { globalContext } from '@/context/GlobalContext'
import { ChatService } from '@/services/ChatService'
import { SearchService } from '@/services/SearchService'
import { windowWidthListener } from '@/services/WindowService'
import type { TThemeOverrides } from '@/config/theme'
import { initOramaClient } from '@/utils/utils'
import type { ColorScheme, ResultMap, SourcesMap } from '@/types'
import type { CloudIndexConfig } from '@/types'

@Component({
  tag: 'orama-search-box',
  styleUrl: 'orama-search-box.scss',
  shadow: true,
})
export class SearchBox {
  @Element() el: HTMLElement

  @Prop() themeConfig?: Partial<TThemeOverrides>
  @Prop() colorScheme?: ColorScheme = 'light'
  @Prop() index: CloudIndexConfig
  @Prop() open? = false
  @Prop() facetProperty?: string
  @Prop() resultMap?: Partial<ResultMap> = {}
  @Prop() sourceBaseUrl?: string
  @Prop() sourcesMap?: SourcesMap
  @Prop() placeholder?: string
  @Prop() suggestions?: string[]

  @State() systemScheme: Omit<ColorScheme, 'system'> = 'light'
  @State() windowWidth: number

  @Watch('index')
  indexChanged() {
    this.startServices()
  }

  @Watch('themeConfig')
  @Watch('colorScheme')
  watchHandler() {
    this.updateTheme()
  }

  @Watch('open')
  handleOpenChange(newValue: boolean) {
    globalContext.open = newValue
  }

  @Watch('facetProperty')
  handleFacetPropertyChange(newValue: string) {
    searchState.facetProperty = newValue
  }

  @Listen('oramaItemClick')
  handleItemClick(event: CustomEvent) {
    // TODO: manage item click
    console.log('Item clicked', event.detail)
  }

  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      globalContext.open = false
    }
  }

  updateTheme() {
    const scheme = this.colorScheme === 'system' ? this.systemScheme : this.colorScheme
    const uiElement = document.querySelector('#orama-ui')

    if (uiElement && scheme) {
      uiElement.classList.remove('theme-light', 'theme-dark')
      uiElement.classList.add(`theme-${scheme}`)
    }

    this.updateCssVariables(scheme as ColorScheme)
  }

  updateCssVariables(scheme: ColorScheme) {
    const config = this.themeConfig
    const root = document.querySelector('#orama-ui') as HTMLElement

    if (root && config && scheme) {
      if (config.colors?.[scheme]) {
        for (const key of Object.keys(config.colors[scheme])) {
          root.style.setProperty(`${key}`, config.colors[scheme][key])
        }
      }
      if (config.typography) {
        for (const key of Object.keys(config.typography)) {
          root.style.setProperty(`${key}`, config.typography[key])
        }
      }
    }
  }

  detectSystemColorScheme() {
    const darkSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    this.systemScheme = darkSchemeQuery.matches ? 'dark' : 'light'

    darkSchemeQuery.addEventListener('change', (event) => {
      this.systemScheme = event.matches ? 'dark' : 'light'
      if (this.colorScheme === 'system') {
        this.updateTheme()
      }
    })
  }

  startServices() {
    const oramaClient = initOramaClient(this.index)
    searchState.searchService = new SearchService(oramaClient)
    chatContext.chatService = new ChatService(oramaClient)
  }

  componentWillLoad() {
    globalContext.open = this.open

    // TODO: We probable want to keep these props below whithin the respective service
    // instance property. I seems to make sense to pass it as initialization prop.
    // Same goes for any other Chat init prop. Lets talk about it as well, please.
    searchState.facetProperty = this.facetProperty
    searchState.resultMap = this.resultMap

    this.startServices()
    this.updateTheme()
    this.detectSystemColorScheme()
  }

  connectedCallback() {
    this.windowWidth = windowWidthListener.width
    windowWidthListener.addEventListener('widthChange', this.updateWindowWidth)
  }

  disconnectedCallback() {
    windowWidthListener.removeEventListener('widthChange', this.updateWindowWidth)
  }

  private updateWindowWidth = (event: CustomEvent) => {
    this.windowWidth = event.detail
  }

  render() {
    if (!searchState.searchService) {
      return <orama-text as="p">Unable to initialize search service</orama-text>
    }

    if (!chatContext.chatService) {
      return <orama-text as="p">Unable to initialize chat service</orama-text>
    }

    return (
      <Fragment>
        <orama-modal open={this.open} class="modal">
          <orama-navigation-bar />
          <div class="main">
            <orama-search
              class={`${globalContext.currentTask === 'search' ? 'section-active' : 'section-inactive'}`}
              focusInput={globalContext.currentTask === 'search'}
            />
            {this.windowWidth <= 1024 && (
              <orama-chat
                class={`${globalContext.currentTask === 'chat' ? 'section-active' : 'section-inactive'}`}
                defaultTerm={globalContext.currentTerm}
                showClearChat={false}
                focusInput={globalContext.currentTask === 'chat'}
              />
            )}
          </div>
          <orama-footer colorScheme={this.colorScheme} />
        </orama-modal>
        {this.windowWidth > 1024 && (
          <orama-sliding-panel
            open={globalContext.currentTask === 'chat'}
            closed={() => {
              globalContext.currentTask = 'search'
            }}
          >
            <orama-chat
              placeholder={this.placeholder}
              defaultTerm={globalContext.currentTerm}
              showClearChat={false}
              sourceBaseUrl={this.sourceBaseUrl}
              sourcesMap={this.sourcesMap}
              focusInput={globalContext.currentTask === 'chat'}
              suggestions={this.suggestions}
            />
          </orama-sliding-panel>
        )}
      </Fragment>
    )
  }
}
