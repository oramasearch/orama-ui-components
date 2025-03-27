import { Component, Watch, Prop, h, State, Element, Listen, Host } from '@stencil/core'
import type { ColorScheme } from '@/types'
import '@phosphor-icons/webcomponents/dist/icons/PhMagnifyingGlass.mjs'
import type { TThemeOverrides } from '@/components'
import { generateRandomID, updateCssVariables, updateThemeClasses } from '@/utils/utils'

export type ButtonClick = {
  id: HTMLElement
  searchboxId: string
}

@Component({
  tag: 'orama-search-button',
  styleUrl: 'orama-search-button.scss',
  shadow: true,
})
export class OramaSearchButton {
  @Element() htmlElement!: HTMLElement

  @Prop() size: 'small' | 'medium' | 'large' = 'medium'
  @Prop() themeConfig?: Partial<TThemeOverrides>
  @Prop() colorScheme?: ColorScheme = 'light'

  @State() systemScheme: Omit<ColorScheme, 'system'> = 'light'
  @State() shortcutLabel = ''
  @State() componentID = generateRandomID('search-button')

  schemaQuery!: MediaQueryList

  @Watch('themeConfig')
  @Watch('colorScheme')
  watchHandler() {
    this.updateTheme()
  }

  buttonRef!: HTMLElement

  @Listen('searchboxClosed', { target: 'body' })
  handleSearchboxClosed(event: CustomEvent<ButtonClick>) {
    // TODO: should be based on the id of current searchbox
    this.buttonRef.querySelector('button').focus()
  }

  // trigger click when entering  '⌘ K' o Mac or 'Ctrl + K'
  @Listen('keydown', { target: 'document' })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.buttonRef.click()
    }
  }

  updateTheme() {
    const scheme = updateThemeClasses(this.htmlElement, this.colorScheme, this.systemScheme)

    updateCssVariables(this.htmlElement, scheme as ColorScheme, this.themeConfig)
  }

  private handleShortcutLabel() {
    const userAgent = navigator.userAgent
    const isMac = userAgent.includes('Mac')

    return isMac ? '⌘ K' : 'Ctrl + K'
  }

  private onPrefersColorSchemeChange = (event) => {
    this.systemScheme = event.matches ? 'dark' : 'light'
    this.updateTheme()
  }
  connectedCallback() {
    this.htmlElement.id = this.componentID
    this.shortcutLabel = this.handleShortcutLabel()

    this.schemaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.systemScheme = this.schemaQuery.matches ? 'dark' : 'light'
    this.updateTheme()

    this.schemaQuery.addEventListener('change', this.onPrefersColorSchemeChange)
  }

  disconnectedCallback() {
    this.schemaQuery.removeEventListener('change', this.onPrefersColorSchemeChange)
  }

  componentWillLoad() {
    this.updateTheme()
  }

  render() {
    return (
      <Host>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: TODO we need to address it. I do not have time now */}
        <orama-button
          type="button"
          variant="secondary"
          ref={(el) => (this.buttonRef = el)}
          size={this.size}
          onClick={() => {
            const searchBoxList = document.getElementsByTagName(
              'orama-search-box',
            ) as unknown as HTMLOramaSearchBoxElement[]

            if (!searchBoxList.length) {
              console.error('No OramaSearchBox found')
              return
            }

            if (searchBoxList.length > 1) {
              console.error(
                'Multiple instances of OramaSearchBox (orama-search-box) found. Considere to assign an ID to OramaSearchBox, implement onClick on OramaSearchButton and select desired OramaSearchBox on onClick method',
              )

              return
            }

            searchBoxList[0].open = true
          }}
        >
          <span slot="adorment-start">
            <ph-magnifying-glass />
          </span>
          <slot />
          <span slot="adorment-end" class="kyb-shortcut">
            {this.shortcutLabel}
          </span>
        </orama-button>
      </Host>
    )
  }
}
