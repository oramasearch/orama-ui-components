import type { SourcesMap, SearchResult, OnAnswerSourceClickCallbackProps } from '@/types'
import { Component, Event, Prop, State, h, type EventEmitter } from '@stencil/core'
import '@phosphor-icons/webcomponents/dist/icons/PhCaretLeft.mjs'
import '@phosphor-icons/webcomponents/dist/icons/PhCaretRight.mjs'

const SOURCE_BOX_OFFSET = 0

@Component({
  tag: 'orama-sources',
  styleUrl: 'orama-sources.scss',
  shadow: true,
})
export class OramaSources {
  carouselSourceRef!: HTMLElement
  // biome-ignore lint/suspicious/noExplicitAny: Sources can be any shape
  @Prop() sources: any
  @Prop() sourceBaseURL?: string = ''
  @Prop() linksTarget?: string = '_blank'
  @Prop() linksRel?: string = 'noopener noreferrer'
  @Prop() sourcesMap?: SourcesMap = {
    title: 'title',
    description: 'description',
    path: 'path',
  }
  divElement!: HTMLDivElement

  @State() isCarouselScrollAtEnd = false
  @State() isCarouselScrollAtStart = false

  @Event({ bubbles: true, composed: true, cancelable: true })
  answerSourceClick: EventEmitter<OnAnswerSourceClickCallbackProps>

  // TODO: Move this to utils
  private buildUrl(path: string): string {
    if (!path) {
      return '#'
    }

    if (this.sourceBaseURL) {
      // Remove trailing slashes from the base URL
      const sanitizedBaseUrl = this.sourceBaseURL.replace(/\/+$/, '')

      // Remove leading slashes from the path
      const sanitizedPath = path.replace(/^\/+/, '')

      // Concatenate the base URL with the path
      return `${sanitizedBaseUrl}/${sanitizedPath}`
    }

    return path
  }

  getNextItemCarousel(container: HTMLElement, items: HTMLCollectionOf<Element>) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemRect = item.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Check if item is totally or partially visible
      if (itemRect.right - SOURCE_BOX_OFFSET > containerRect.right) {
        return item
      }
    }

    return null
  }

  getPreviousItemCarousel(container: HTMLElement, items: HTMLCollectionOf<Element>) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemRect = item.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // Check if the item is totally visible
      if (
        itemRect.left + SOURCE_BOX_OFFSET >= containerRect.left &&
        itemRect.right - SOURCE_BOX_OFFSET <= containerRect.right
      ) {
        return items[i - 1] ?? null
        // biome-ignore lint/style/noUselessElse: better with to make the intention clear
      } else if (
        itemRect.left - SOURCE_BOX_OFFSET < containerRect.right &&
        itemRect.right - SOURCE_BOX_OFFSET > containerRect.right
      ) {
        return item
      }
    }

    return null
  }

  private handleCarouselMove(direction: 'forward' | 'backwards') {
    const carousel = this.carouselSourceRef

    if (!carousel) {
      return
    }

    const items = carousel.getElementsByClassName('source-inner-wrapper')

    if (direction === 'forward') {
      const nextItemCarousel = this.getNextItemCarousel(carousel, items)
      if (nextItemCarousel) {
        nextItemCarousel.scrollIntoView({
          behavior: 'smooth',
          inline: 'end',
          block: 'nearest',
        })
      }
    } else {
      const previousItemCarousel = this.getPreviousItemCarousel(carousel, items)
      if (previousItemCarousel) {
        previousItemCarousel.scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'nearest',
        })
      }
    }
  }

  handleCarouselScroll = () => {
    this.computeCarouselArrowsVisibility()
  }

  handleItemClick = (originalOnClickEvent: MouseEvent, item: SearchResult) => {
    const answerSourceClick = this.answerSourceClick.emit({ source: item })

    if (answerSourceClick.defaultPrevented) {
      originalOnClickEvent.preventDefault()
      return
    }

    if (!item?.path) {
      throw new Error('No path found')
    }
  }

  computeCarouselArrowsVisibility() {
    const carousel = this.carouselSourceRef

    if (!carousel) {
      return
    }

    const items = carousel.getElementsByClassName('source-inner-wrapper')

    this.isCarouselScrollAtEnd = !this.getNextItemCarousel(carousel, items)
    this.isCarouselScrollAtStart = !this.getPreviousItemCarousel(carousel, items)
  }

  resizeObserver = new ResizeObserver(() => {
    this.computeCarouselArrowsVisibility()
  })

  componentDidLoad() {
    this.carouselSourceRef?.addEventListener('scroll', this.handleCarouselScroll)
    this.computeCarouselArrowsVisibility()

    if (this.carouselSourceRef) {
      this.resizeObserver.observe(this.carouselSourceRef)
    }
  }

  disconnectedCallback() {
    this.carouselSourceRef?.removeEventListener('scroll', this.handleCarouselScroll)
    this.resizeObserver.disconnect()
  }

  hasHorizontalOverflow(element) {
    if (!element) {
      return false
    }
    return element.scrollWidth > element.clientWidth
  }

  render() {
    if (!this.sources?.length) {
      return
    }

    return (
      <host>
        <div
          class={{
            'sources-outer-wrapper': true,
            'oveflow-decorator': this.hasHorizontalOverflow(this.carouselSourceRef),
          }}
        >
          <h2 class="sr-only">Sources</h2>

          <button
            class={{ 'carousel-arrow carousel-arrow--prev': true, hidden: this.isCarouselScrollAtStart }}
            onClick={() => this.handleCarouselMove('backwards')}
            type="button"
          >
            <ph-caret-left />
          </button>

          <button
            class={{ 'carousel-arrow carousel-arrow--next': true, hidden: this.isCarouselScrollAtEnd }}
            onClick={() => this.handleCarouselMove('forward')}
            type="button"
          >
            <ph-caret-right />
          </button>
          <div
            class="sources-wrapper"
            ref={(el) => {
              this.carouselSourceRef = el
            }}
          >
            {this.sources.map((source, index) => {
              const showSources =
                (!!source[this.sourcesMap.title] && !!source[this.sourcesMap.path]) ||
                (!!source[this.sourcesMap.description] && !!source[this.sourcesMap.path])

              if (!showSources) return

              return (
                <div
                  class="source-inner-wrapper"
                  // biome-ignore lint/suspicious/noArrayIndexKey: we do not have id for sources
                  key={`source-${index}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                  }}
                >
                  <a
                    href={this.buildUrl(source[this.sourcesMap.path])}
                    class="source"
                    target={this.linksTarget}
                    rel={this.linksRel}
                    id={`source-${index}`}
                    onClick={(onClickEvent) => this.handleItemClick(onClickEvent, source)}
                  >
                    <orama-text as="h3" styledAs="span" class="source-title">
                      {source[this.sourcesMap.title]}
                    </orama-text>
                    <orama-text as="p" styledAs="span" class="source-subtitle" variant="tertiary">
                      {source[this.sourcesMap.description]}
                    </orama-text>
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </host>
    )
  }
}
