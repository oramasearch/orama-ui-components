import type { Facet } from '@/types'
import { Component, h, Prop } from '@stencil/core'

@Component({
  tag: 'orama-facets',
  styleUrl: 'orama-facets.scss',
  scoped: true,
})

/**
 * The orama-facets component renders a list of facets
 */
export class OramaFacets {
  @Prop() facets: Facet[]
  @Prop() selectedFacet: string
  @Prop() facetClicked: (facetName: string) => void

  handleClick(facet: Facet) {
    this.facetClicked(facet.name)
  }

  render() {
    if (!this.facets || this.facets.every((facet) => !facet.count)) {
      return null
    }

    return (
      <ul class="facets-list">
        {this.facets?.map((facet) => {
          if (facet?.count === 0) {
            return
          }
          const isSelected = this.selectedFacet === facet?.name || (!this.selectedFacet && facet?.name === 'All')
          return (
            <li key={facet.name} class="facet">
              <button
                type="button"
                class={{
                  'facet-button': true,
                  'facet-button--selected': isSelected,
                }}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => this.handleClick(facet)}
              >
                {facet?.name}
                <span class="facet-count">{facet?.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }
}
